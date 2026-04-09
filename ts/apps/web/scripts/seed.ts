/**
 * Seed script: loads entries + examples from py/data/entities/*.json,
 * merges expressions/relatedWord/grammaticalNote from py/data/xml_processing/mongo_items.json,
 * and inserts everything into Postgres (local or Neon).
 *
 * Usage: DATABASE_URL=postgres://mbay:mbay@localhost:5432/mbay bun run scripts/seed.ts
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL or VITE_DATABASE_URL env var required')
  process.exit(1)
}

const client = new pg.Client({ connectionString: DATABASE_URL, ssl: DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false })

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..')

interface RawEntry {
  id: number
  headword: string
  english_translation: string
  french_translation: string
  part_of_speech: string | null
  sound_filename: string | null
  example_ids: number[]
}

interface RawExample {
  id: number
  entry_id: number
  mbay: string
  english_translation: string
  french_translation: string
  sound_filename: string | null
}

interface MongoTranslation {
  key: string
  translation: string
}

interface MongoExpression {
  mbay: string
  english: MongoTranslation
  french: MongoTranslation
  soundFilename: string | null
  example: {
    mbay: string
    english: MongoTranslation
    french: MongoTranslation
    soundFilename: string | null
  } | null
}

interface MongoItem {
  headword: string
  partOfSpeech: string | null
  grammaticalNote: { french: string; english: string } | null
  relatedWord: { text: string } | null
  expressions: MongoExpression[]
}

function loadJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(resolve(ROOT, relPath), 'utf-8'))
}

async function main() {
  await client.connect()
  console.log('Connected to database.')

  console.log('Loading data...')
  const entries = loadJson<RawEntry[]>('py/data/entities/entries.json')
  const examples = loadJson<RawExample[]>('py/data/entities/examples.json')
  const mongoItems = loadJson<MongoItem[]>(
    'py/data/xml_processing/mongo_items.json',
  )

  const mongoLookup = new Map<string, MongoItem>()
  for (const item of mongoItems) {
    const key = `${item.headword}\0${item.partOfSpeech ?? ''}`
    mongoLookup.set(key, item)
  }

  console.log(
    `Loaded: ${entries.length} entries, ${examples.length} examples, ${mongoItems.length} mongo items`,
  )

  // Truncate
  console.log('Truncating tables...')
  await client.query(
    'TRUNCATE related_words, expressions, examples, entries CASCADE',
  )

  // Insert entries in batches of 100
  console.log('Inserting entries...')
  const unmatched: string[] = []
  let matchCount = 0

  for (let i = 0; i < entries.length; i += 100) {
    const batch = entries.slice(i, i + 100)
    const values = batch.map((e) => {
      const key = `${e.headword}\0${e.part_of_speech ?? ''}`
      const mongo = mongoLookup.get(key)
      if (mongo) matchCount++
      else
        unmatched.push(`entry ${e.id}: ${e.headword} [${e.part_of_speech}]`)

      return `(${e.id}, ${esc(e.headword)}, ${esc(e.part_of_speech)}, ${esc(e.english_translation)}, ${esc(e.french_translation)}, ${esc(e.sound_filename)}, ${esc(mongo?.grammaticalNote?.french ?? null)}, ${esc(mongo?.grammaticalNote?.english ?? null)})`
    })

    await client.query(
      `INSERT INTO entries (id, headword, part_of_speech, english, french, sound_filename, grammatical_note_fr, grammatical_note_en) VALUES ${values.join(', ')} ON CONFLICT (id) DO NOTHING`,
    )

    if (i % 1000 === 0) process.stdout.write(`  ${i}/${entries.length}\r`)
  }

  console.log(
    `Entries done. Matched ${matchCount}/${entries.length} with mongo data. ${unmatched.length} unmatched.`,
  )

  // Insert examples
  console.log('Inserting examples...')
  for (let i = 0; i < examples.length; i += 100) {
    const batch = examples.slice(i, i + 100)
    const values = batch.map(
      (ex) =>
        `(${ex.id}, ${ex.entry_id}, ${esc(ex.mbay)}, ${esc(ex.english_translation)}, ${esc(ex.french_translation)}, ${esc(ex.sound_filename)})`,
    )

    await client.query(
      `INSERT INTO examples (id, entry_id, mbay, english, french, sound_filename) VALUES ${values.join(', ')} ON CONFLICT (id) DO NOTHING`,
    )
  }
  console.log(`Examples done: ${examples.length} rows.`)

  // Insert expressions from mongo data
  console.log('Inserting expressions...')
  let exprCount = 0
  for (const entry of entries) {
    const key = `${entry.headword}\0${entry.part_of_speech ?? ''}`
    const mongo = mongoLookup.get(key)
    if (!mongo?.expressions?.length) continue

    for (const expr of mongo.expressions) {
      const values = `(${entry.id}, ${esc(expr.mbay)}, ${esc(expr.english?.translation ?? '')}, ${esc(expr.french?.translation ?? '')}, ${esc(expr.soundFilename)}, ${esc(expr.example?.mbay ?? null)}, ${esc(expr.example?.english?.translation ?? null)}, ${esc(expr.example?.french?.translation ?? null)}, ${esc(expr.example?.soundFilename ?? null)})`

      await client.query(
        `INSERT INTO expressions (entry_id, mbay, english, french, sound_filename, example_mbay, example_english, example_french, example_sound) VALUES ${values}`,
      )
      exprCount++
    }
  }
  console.log(`Expressions done: ${exprCount} rows.`)

  // Insert related words
  console.log('Inserting related words...')
  let relCount = 0
  for (const entry of entries) {
    const key = `${entry.headword}\0${entry.part_of_speech ?? ''}`
    const mongo = mongoLookup.get(key)
    if (!mongo?.relatedWord?.text) continue

    const relText = mongo.relatedWord.text
    const relEntry = entries.find((e) => e.headword === relText)

    await client.query(
      `INSERT INTO related_words (entry_id, text, related_entry_id) VALUES (${entry.id}, ${esc(relText)}, ${relEntry ? relEntry.id : 'NULL'}) ON CONFLICT (entry_id) DO NOTHING`,
    )
    relCount++
  }
  console.log(`Related words done: ${relCount} rows.`)

  // Write unmatched log
  if (unmatched.length > 0) {
    const logPath = resolve(import.meta.dirname, 'seed-unmatched.log')
    writeFileSync(logPath, unmatched.join('\n'))
    console.log(`Wrote ${unmatched.length} unmatched entries to ${logPath}`)
  }

  // Print summary
  const counts = await client.query(`
    SELECT
      (SELECT count(*) FROM entries) AS entries,
      (SELECT count(*) FROM examples) AS examples,
      (SELECT count(*) FROM expressions) AS expressions,
      (SELECT count(*) FROM related_words) AS related_words
  `)
  console.log('\nFinal counts:', counts.rows[0])
  console.log('Seed complete!')

  await client.end()
}

function esc(v: string | null | undefined): string {
  if (v == null) return 'NULL'
  return `'${v.replace(/'/g, "''")}'`
}

main().catch(async (err) => {
  console.error('Seed failed:', err)
  await client.end()
  process.exit(1)
})
