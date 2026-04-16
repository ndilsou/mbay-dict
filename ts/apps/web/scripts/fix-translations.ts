import { GoogleGenAI, Type } from '@google/genai'
import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!DATABASE_URL) { console.error('DATABASE_URL required'); process.exit(1) }
if (!GEMINI_API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1) }

const DRY_RUN = process.argv.includes('--dry-run')
const MODEL = 'gemini-flash-lite-latest'
const BATCH = 20

const BAD_CLAUSE = `(
  french IN ('Hello','Hello, world!')
  OR french ILIKE '%Le résultat de la traduction%'
  OR (french = 'Bonjour' AND english NOT ILIKE '%hello%' AND english NOT ILIKE '%greet%')
)`

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

async function translate(items: { id: number; english: string }[]): Promise<Record<number, string>> {
  const prompt = `You are translating a Mbay-English-French dictionary. Translate each English gloss to French, preserving the dictionary style (terse, lowercase start unless proper noun, keep bracketed annotations like {...} or [...] verbatim, keep parenthetical notes). Return only the French translation for each id.

Items:
${items.map(i => `${i.id}: ${i.english}`).join('\n')}`

  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            french: { type: Type.STRING },
          },
          required: ['id', 'french'],
        },
      },
    },
  })
  const parsed = JSON.parse(res.text ?? '[]') as { id: number; french: string }[]
  return Object.fromEntries(parsed.map(p => [p.id, p.french]))
}

async function fixTable(client: pg.Client, table: 'entries' | 'examples') {
  const { rows } = await client.query<{ id: number; english: string; french: string }>(
    `SELECT id, english, french FROM ${table} WHERE ${BAD_CLAUSE} ORDER BY id`
  )
  console.log(`[${table}] ${rows.length} bad rows`)
  if (rows.length === 0) return

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const translations = await translate(batch)
    for (const row of batch) {
      const fr = translations[row.id]
      if (!fr) { console.warn(`  skip ${row.id} (no translation)`); continue }
      console.log(`  ${row.id}: "${row.english.slice(0, 60)}" -> "${fr}"`)
      if (!DRY_RUN) {
        await client.query(`UPDATE ${table} SET french = $1, updated_at = now() WHERE id = $2`, [fr, row.id])
      }
    }
  }
}

async function main() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL!.includes('neon.tech') ? { rejectUnauthorized: false } : false,
  })
  await client.connect()
  console.log(`Connected${DRY_RUN ? ' (DRY RUN)' : ''}. Target: ${DATABASE_URL!.includes('neon.tech') ? 'NEON' : 'LOCAL'}`)
  try {
    await fixTable(client, 'entries')
    await fixTable(client, 'examples')
  } finally {
    await client.end()
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
