import "server-only";

import { cache } from "react";
import { MongoClient, ObjectId } from "mongodb";
import { z } from "zod";
import { env } from "./env";
import { INDEX_KEYS, IndexKeySchema, type IndexKey } from "./constants";

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

export const TranslationSchema = z.object({
  key: IndexKeySchema,
  translation: z.string(),
});

export const EntrySchema = z.object({
  _id: ObjectIdSchema,
  created_at: z.string(),
  updated_at: z.string(),
  headword: z.string(),
  french: TranslationSchema,
  english: TranslationSchema,
  part_of_speech: z.string().nullable().default(null),
  sound_filename: z.string().nullable().default(null),
  examples: z.array(ExampleSchema),
});

export type Entry = z.infer<typeof EntrySchema>;

export const IndexEntrySchema = z.object({
  _id: ObjectIdSchema,
  headword: z.string(),
  french: TranslationSchema,
  english: TranslationSchema,
  part_of_speech: z.string().nullable().default(null),
  sound_filename: z.string().nullable().default(null),
  examples: z.array(z.object({ _id: ObjectIdSchema })),
});

export type IndexEntry = z.infer<typeof IndexEntrySchema>;

const ENTRY_INDEX_PROJECTION = {
  headword: true,
  english: true,
  french: true,
  part_of_speech: true,
  sound_filename: true,
  examples: {
    _id: 1,
  },
};

export const listEntriesIndex = cache(async (): Promise<IndexEntry[]> => {
  const db = getDB();
  const entries = await db
    .collection("entries")
    .find(
      {},
      {
        projection: ENTRY_INDEX_PROJECTION,
      }
    )
    .toArray();

  return IndexEntrySchema.array().parse(entries);
});

export const listEntriesAtLetter = cache(
  async ({
    letter,
    language = "french",
  }: {
    letter: IndexKey;
    language?: "french" | "english";
  }): Promise<IndexEntry[]> => {
    const key = `${language}.key`;
    const db = getDB();
    const entries = await db
      .collection("entries")
      .find(
        { [key]: letter },
        {
          projection: ENTRY_INDEX_PROJECTION,
        }
      )
      .toArray();

    return IndexEntrySchema.array().parse(entries);
  }
);

export const searchEntries = cache(
  async ({
    searchTerm,
    language = "french",
  }: {
    language?: "french" | "english";
    searchTerm: string;
  }): Promise<IndexEntry[]> => {
    const key = `${language}.translation`;
    const db = getDB();
    const entries = await db
      .collection("entries")
      .find(
        { [key]: { $regex: `${searchTerm}` } },
        {
          projection: ENTRY_INDEX_PROJECTION,
        }
      )
      .toArray();

    return IndexEntrySchema.array().parse(entries);
  }
);

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

export const listEntryIds = cache(async (): Promise<string[]> => {
  const db = getDB();
  const entries = await db
    .collection("entries")
    .find(
      {},
      {
        projection: {
          _id: true,
        },
      }
    )
    .toArray();

  const ids = entries.map((entry) => entry._id);
  return ObjectIdSchema.array().parse(ids);
});
