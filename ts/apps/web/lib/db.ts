import { cache } from "react";
import { MongoClient, ObjectId } from "mongodb";
import { z } from "zod";
import { env } from "./env";

const client = new MongoClient(env.MONGODB_URI, {
  tls: true,
  socketTimeoutMS: 5000,
  connectTimeoutMS: 1000,
});

export function getDB() {
  return client.db("dictionary");
}

const ObjectIdSchema = z
  .instanceof(ObjectId)
  .refine(ObjectId.isValid, {
    message: "invalid object id",
  })
  .transform((_objectId) => _objectId.toString());

export const ExampleSchema = z.object({
  _id: ObjectIdSchema,
  created_at: z.string(),
  updated_at: z.string(),
  entry_id: z.number(),
  mbay: z.string(),
  english_translation: z.string(),
  french_translation: z.string(),
  sound_filename: z.string().nullable().default(null),
});

export type Example = z.infer<typeof ExampleSchema>;

export const EntrySchema = z.object({
  _id: ObjectIdSchema,
  created_at: z.string(),
  updated_at: z.string(),
  headword: z.string(),
  english_translation: z.string(),
  french_translation: z.string(),
  part_of_speech: z.string().nullable().default(null),
  sound_filename: z.string().nullable().default(null),
  examples: z.array(ExampleSchema),
});

export type Entry = z.infer<typeof EntrySchema>;

export const IndexEntrySchema = z.object({
  _id: ObjectIdSchema,
  headword: z.string(),
  english_translation: z.string(),
  french_translation: z.string(),
  part_of_speech: z.string().nullable().default(null),
  sound_filename: z.string().nullable().default(null),
  examples: z.array(z.object({ _id: ObjectIdSchema })),
});

export type IndexEntry = z.infer<typeof IndexEntrySchema>;

export const listEntriesIndex = cache(async (): Promise<IndexEntry[]> => {
  const db = getDB();
  const entries = await db
    .collection("entries")
    .find(
      {},
      {
        projection: {
          headword: true,
          english_translation: true,
          french_translation: true,
          part_of_speech: true,
          sound_filename: true,
          examples: {
            _id: 1,
          },
        },
      }
    )
    .toArray();

  return IndexEntrySchema.array().parse(entries);
});

export const getEntry = cache(async (id: string): Promise<Entry> => {
  const db = getDB();
  const entry = await db
    .collection("entries")
    .findOne({ _id: new ObjectId(id) });
  if (!entry) {
    throw new Error("Entry not found");
  }
  return EntrySchema.parse(entry);
});

export const ExamplesSchema = z.object({
  _id: ObjectIdSchema,
  examples: z.array(ExampleSchema),
});

export type EntryExamples = z.infer<typeof ExamplesSchema>;

export const getExamples = cache(async (id: string): Promise<EntryExamples> => {
  const db = getDB();
  const result = await db
    .collection("entries")
    .findOne({ _id: new ObjectId(id) }, { projection: { examples: true } });
  if (!result) {
    throw new Error("Entry not found");
  }
  return ExamplesSchema.parse(result);
});
