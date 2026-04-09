CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Immutable wrapper for unaccent (required for generated columns)
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
  RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
AS $$ SELECT unaccent($1) $$;

CREATE TABLE entries (
  id                  INTEGER PRIMARY KEY,
  headword            TEXT NOT NULL,
  part_of_speech      TEXT,
  english             TEXT NOT NULL,
  french              TEXT NOT NULL,
  sound_filename      TEXT,
  grammatical_note_fr TEXT,
  grammatical_note_en TEXT,
  head_letter         TEXT GENERATED ALWAYS AS (LOWER(LEFT(immutable_unaccent(headword), 1))) STORED,
  search_tsv          tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', immutable_unaccent(coalesce(headword, ''))), 'A') ||
    setweight(to_tsvector('english', immutable_unaccent(coalesce(english, ''))), 'B') ||
    setweight(to_tsvector('french',  immutable_unaccent(coalesce(french, ''))),  'B')
  ) STORED,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX entries_search_tsv_idx  ON entries USING GIN (search_tsv);
CREATE INDEX entries_headword_trgm   ON entries USING GIN (headword  gin_trgm_ops);
CREATE INDEX entries_english_trgm    ON entries USING GIN (english   gin_trgm_ops);
CREATE INDEX entries_french_trgm     ON entries USING GIN (french    gin_trgm_ops);
CREATE INDEX entries_head_letter_idx ON entries (head_letter);

CREATE TABLE examples (
  id             INTEGER PRIMARY KEY,
  entry_id       INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  mbay           TEXT NOT NULL,
  english        TEXT NOT NULL,
  french         TEXT NOT NULL,
  sound_filename TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX examples_entry_id_idx ON examples (entry_id);

CREATE TABLE expressions (
  id              SERIAL PRIMARY KEY,
  entry_id        INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  mbay            TEXT NOT NULL,
  english         TEXT NOT NULL,
  french          TEXT NOT NULL,
  sound_filename  TEXT,
  example_mbay    TEXT,
  example_english TEXT,
  example_french  TEXT,
  example_sound   TEXT
);

CREATE INDEX expressions_entry_id_idx ON expressions (entry_id);

CREATE TABLE related_words (
  entry_id         INTEGER PRIMARY KEY REFERENCES entries(id) ON DELETE CASCADE,
  text             TEXT NOT NULL,
  related_entry_id INTEGER REFERENCES entries(id) ON DELETE SET NULL
);
