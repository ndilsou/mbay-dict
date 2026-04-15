-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS unaccent;
--> statement-breakpoint

-- Immutable wrapper for unaccent (required for generated columns)
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
  RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
AS $$ SELECT unaccent($1) $$;
--> statement-breakpoint

-- Generated columns on entries
ALTER TABLE "entries"
  DROP COLUMN IF EXISTS "head_letter",
  ADD COLUMN "head_letter" text GENERATED ALWAYS AS (LOWER(LEFT(immutable_unaccent(headword), 1))) STORED;
--> statement-breakpoint
ALTER TABLE "entries"
  DROP COLUMN IF EXISTS "french_letter",
  ADD COLUMN "french_letter" text GENERATED ALWAYS AS (LOWER(LEFT(immutable_unaccent(
    REGEXP_REPLACE(french, '^[''\\(\\{\\[\\-\\s]+', '', 'g')
  ), 1))) STORED;
--> statement-breakpoint
ALTER TABLE "entries"
  DROP COLUMN IF EXISTS "english_letter",
  ADD COLUMN "english_letter" text GENERATED ALWAYS AS (LOWER(LEFT(immutable_unaccent(
    REGEXP_REPLACE(english, '^[''\\(\\{\\[\\-\\s]+', '', 'g')
  ), 1))) STORED;
--> statement-breakpoint

-- Full-text search vector
ALTER TABLE "entries"
  ADD COLUMN IF NOT EXISTS "search_tsv" tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', immutable_unaccent(coalesce(headword, ''))), 'A') ||
    setweight(to_tsvector('english', immutable_unaccent(coalesce(english, ''))), 'B') ||
    setweight(to_tsvector('french',  immutable_unaccent(coalesce(french, ''))),  'B')
  ) STORED;
--> statement-breakpoint

-- GIN indexes for full-text and trigram search
CREATE INDEX IF NOT EXISTS entries_search_tsv_idx   ON entries USING GIN (search_tsv);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS entries_headword_trgm    ON entries USING GIN (headword  gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS entries_english_trgm     ON entries USING GIN (english   gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS entries_french_trgm      ON entries USING GIN (french    gin_trgm_ops);
--> statement-breakpoint

-- Letter indexes
CREATE INDEX IF NOT EXISTS entries_french_letter_idx  ON entries (french_letter);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS entries_english_letter_idx ON entries (english_letter);
