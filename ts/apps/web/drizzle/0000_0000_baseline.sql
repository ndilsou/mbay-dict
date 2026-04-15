CREATE TABLE "entries" (
	"id" integer PRIMARY KEY NOT NULL,
	"headword" text NOT NULL,
	"part_of_speech" text,
	"english" text NOT NULL,
	"french" text NOT NULL,
	"sound_filename" text,
	"grammatical_note_fr" text,
	"grammatical_note_en" text,
	"head_letter" text,
	"french_letter" text,
	"english_letter" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "examples" (
	"id" integer PRIMARY KEY NOT NULL,
	"entry_id" integer NOT NULL,
	"mbay" text NOT NULL,
	"english" text NOT NULL,
	"french" text NOT NULL,
	"sound_filename" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expressions" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_id" integer NOT NULL,
	"mbay" text NOT NULL,
	"english" text NOT NULL,
	"french" text NOT NULL,
	"sound_filename" text,
	"example_mbay" text,
	"example_english" text,
	"example_french" text,
	"example_sound" text
);
--> statement-breakpoint
CREATE TABLE "related_words" (
	"entry_id" integer PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"related_entry_id" integer
);
--> statement-breakpoint
ALTER TABLE "examples" ADD CONSTRAINT "examples_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expressions" ADD CONSTRAINT "expressions_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_words" ADD CONSTRAINT "related_words_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_words" ADD CONSTRAINT "related_words_related_entry_id_entries_id_fk" FOREIGN KEY ("related_entry_id") REFERENCES "public"."entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entries_head_letter_idx" ON "entries" USING btree ("head_letter");--> statement-breakpoint
CREATE INDEX "examples_entry_id_idx" ON "examples" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "expressions_entry_id_idx" ON "expressions" USING btree ("entry_id");