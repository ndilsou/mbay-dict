import { readFileSync, readSync } from "fs";
import { z } from "zod";

export const EntrySchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  headword: z.string(),
  english_translation: z.string(),
  french_translation: z.string(),
  part_of_speech: z.string().nullable().default(null),
  sound_filename: z.string().nullable().default(null),
  example_ids: z.array(z.number()),
});

export type Entry = z.infer<typeof EntrySchema>;

export const ExampleSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  entry_id: z.number(),
  mbay: z.string(),
  english_translation: z.string(),
  french_translation: z.string(),
  sound_filename: z.string().nullable().default(null),
});

export type Example = z.infer<typeof ExampleSchema>;

export const entriesDataset = EntrySchema.array().parse(
  JSON.parse(
    readFileSync("./data/entries.json", {
      encoding: "utf-8",
    }),
  ),
);
export const examplesDataset = ExampleSchema.array().parse(
  JSON.parse(
    readFileSync("./data/examples.json", {
      encoding: "utf-8",
    }),
  ),
);

console.log("data loaded");
