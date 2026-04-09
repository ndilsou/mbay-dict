import { createServerFn } from '@tanstack/react-start'
import { eq, sql, asc } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '@/db'
import { entries, examples, expressions, relatedWords } from '@/db/schema'

// --- Types ---

export type EntryListItem = {
  id: number
  headword: string
  partOfSpeech: string | null
  english: string
  french: string
  soundFilename: string | null
}

export type SearchResult = EntryListItem & {
  rank: number
  similarity: number
}

export type EntryDetail = {
  id: number
  headword: string
  partOfSpeech: string | null
  english: string
  french: string
  soundFilename: string | null
  grammaticalNoteFr: string | null
  grammaticalNoteEn: string | null
  examples: {
    id: number
    mbay: string
    english: string
    french: string
    soundFilename: string | null
  }[]
  expressions: {
    id: number
    mbay: string
    english: string
    french: string
    soundFilename: string | null
    exampleMbay: string | null
    exampleEnglish: string | null
    exampleFrench: string | null
    exampleSound: string | null
  }[]
  relatedWord: {
    text: string
    relatedEntryId: number | null
  } | null
}

// --- Server Functions ---

export const listLetters = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = getDb()
    const result = await db
      .selectDistinct({ letter: entries.headLetter })
      .from(entries)
      .orderBy(asc(entries.headLetter))
    return result
      .map((r) => r.letter)
      .filter((l): l is string => l != null)
  },
)

export const listByLetter = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ letter: z.string().min(1).max(5) }).parse)
  .handler(async ({ data }) => {
    const db = getDb()
    const result = await db
      .select({
        id: entries.id,
        headword: entries.headword,
        partOfSpeech: entries.partOfSpeech,
        english: entries.english,
        french: entries.french,
        soundFilename: entries.soundFilename,
      })
      .from(entries)
      .where(eq(entries.headLetter, data.letter.toLowerCase()))
      .orderBy(asc(entries.headword))
    return result as EntryListItem[]
  },
)

export const searchEntries = createServerFn({ method: 'GET' })
  .inputValidator(z.object({
    q: z.string().min(1).max(200),
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).default(0),
  }).parse)
  .handler(async ({ data }) => {
    const db = getDb()
    const limit = data.limit ?? 50
    const offset = data.offset ?? 0

    const result = await db.execute(sql`
      WITH q AS (
        SELECT
          unaccent(${data.q}) AS raw,
          plainto_tsquery('simple', unaccent(${data.q})) AS tsq
      )
      SELECT
        e.id, e.headword, e.part_of_speech AS "partOfSpeech",
        e.english, e.french, e.sound_filename AS "soundFilename",
        ts_rank(e.search_tsv, q.tsq) AS rank,
        GREATEST(
          similarity(unaccent(e.headword), q.raw),
          similarity(unaccent(e.english),  q.raw),
          similarity(unaccent(e.french),   q.raw)
        ) AS similarity
      FROM entries e, q
      WHERE e.search_tsv @@ q.tsq
         OR unaccent(e.headword) % q.raw
         OR unaccent(e.english)  % q.raw
         OR unaccent(e.french)   % q.raw
      ORDER BY (ts_rank(e.search_tsv, q.tsq) * 2 + GREATEST(
          similarity(unaccent(e.headword), q.raw),
          similarity(unaccent(e.english),  q.raw),
          similarity(unaccent(e.french),   q.raw)
        )) DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    return result.rows as SearchResult[]
  },
)

export const getEntry = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.number().int().positive() }).parse)
  .handler(async ({ data }) => {
    const db = getDb()

    const [entry, entryExamples, entryExpressions, entryRelated] =
      await Promise.all([
        db
          .select()
          .from(entries)
          .where(eq(entries.id, data.id))
          .then((r) => r[0]),
        db
          .select()
          .from(examples)
          .where(eq(examples.entryId, data.id)),
        db
          .select()
          .from(expressions)
          .where(eq(expressions.entryId, data.id)),
        db
          .select()
          .from(relatedWords)
          .where(eq(relatedWords.entryId, data.id))
          .then((r) => r[0] ?? null),
      ])

    if (!entry) return null

    return {
      id: entry.id,
      headword: entry.headword,
      partOfSpeech: entry.partOfSpeech,
      english: entry.english,
      french: entry.french,
      soundFilename: entry.soundFilename,
      grammaticalNoteFr: entry.grammaticalNoteFr,
      grammaticalNoteEn: entry.grammaticalNoteEn,
      examples: entryExamples,
      expressions: entryExpressions,
      relatedWord: entryRelated,
    } as EntryDetail
  },
)

export const getRandomEntry = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = getDb()
    const result = await db.execute(
      sql`SELECT id, headword, part_of_speech AS "partOfSpeech", english, french, sound_filename AS "soundFilename" FROM entries ORDER BY random() LIMIT 1`,
    )
    return (result.rows[0] ?? null) as EntryListItem | null
  },
)
