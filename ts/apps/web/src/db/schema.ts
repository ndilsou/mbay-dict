import {
  pgTable,
  text,
  integer,
  serial,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

export const entries = pgTable(
  'entries',
  {
    id: integer('id').primaryKey(),
    headword: text('headword').notNull(),
    partOfSpeech: text('part_of_speech'),
    english: text('english').notNull(),
    french: text('french').notNull(),
    soundFilename: text('sound_filename'),
    grammaticalNoteFr: text('grammatical_note_fr'),
    grammaticalNoteEn: text('grammatical_note_en'),
    // head_letter and search_tsv are generated columns managed by SQL
    headLetter: text('head_letter'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('entries_head_letter_idx').on(t.headLetter)],
)

export const examples = pgTable(
  'examples',
  {
    id: integer('id').primaryKey(),
    entryId: integer('entry_id')
      .notNull()
      .references(() => entries.id, { onDelete: 'cascade' }),
    mbay: text('mbay').notNull(),
    english: text('english').notNull(),
    french: text('french').notNull(),
    soundFilename: text('sound_filename'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('examples_entry_id_idx').on(t.entryId)],
)

export const expressions = pgTable(
  'expressions',
  {
    id: serial('id').primaryKey(),
    entryId: integer('entry_id')
      .notNull()
      .references(() => entries.id, { onDelete: 'cascade' }),
    mbay: text('mbay').notNull(),
    english: text('english').notNull(),
    french: text('french').notNull(),
    soundFilename: text('sound_filename'),
    exampleMbay: text('example_mbay'),
    exampleEnglish: text('example_english'),
    exampleFrench: text('example_french'),
    exampleSound: text('example_sound'),
  },
  (t) => [index('expressions_entry_id_idx').on(t.entryId)],
)

export const relatedWords = pgTable('related_words', {
  entryId: integer('entry_id')
    .primaryKey()
    .references(() => entries.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  relatedEntryId: integer('related_entry_id').references(() => entries.id, {
    onDelete: 'set null',
  }),
})
