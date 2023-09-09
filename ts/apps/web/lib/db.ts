import "server-only";

import { cache } from "react";
import { MongoClient, ObjectId } from "mongodb";
import { z } from "zod";
import { env } from "./env";
import { type IndexKey } from "./constants";

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

const TranslationSchema = z.object({
  key: z.string(),
  translation: z.string(),
});

const ParentIdSchema = z.object({
  id: ObjectIdSchema,
  type: z.literal("entry").or(z.literal("expression")),
});

export const ExampleSchema = z.object({
  _id: ObjectIdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  parentId: ParentIdSchema,
  mbay: z.string(),
  english: TranslationSchema,
  french: TranslationSchema,
  soundFilename: z.string().nullable(),
});

export type Example = z.infer<typeof ExampleSchema>;

export const ExpressionSchema = z.object({
  _id: ObjectIdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  entryId: ObjectIdSchema,
  mbay: z.string(),
  english: TranslationSchema,
  french: TranslationSchema,
  soundFilename: z.string().nullable(),
  example: ExampleSchema.nullable(),
});

export type Expression = z.infer<typeof ExpressionSchema>;

export const EntrySchema = z.object({
  _id: ObjectIdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  headword: z.string(),
  partOfSpeech: z.string().nullable(),
  soundFilename: z.string().nullable(),
  french: TranslationSchema,
  english: TranslationSchema,
  relatedWord: z
    .object({
      text: z.string().nullable(),
      id: ObjectIdSchema.nullable(),
    })
    .nullable()
    .default(null),
  grammaticalNote: z
    .object({
      french: z.string(),
      english: z.string(),
    })
    .nullable()
    .default(null),
  examples: z.array(ExampleSchema),
  expressions: z.array(ExpressionSchema),
});

export type Entry = z.infer<typeof EntrySchema>;

export const IndexEntrySchema = EntrySchema.extend({
  examples: z.array(z.object({ _id: ObjectIdSchema })),
  expressions: z.array(z.object({ _id: ObjectIdSchema })),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export type IndexEntry = z.infer<typeof IndexEntrySchema>;
const ENTRY_INDEX_PROJECTION = {
  headword: true,
  english: true,
  french: true,
  partOfSpeech: true,
  soundFilename: true,
  relatedWord: true,
  grammaticalNote: true,
  expressions: {
    _id: 1,
  },
  examples: {
    _id: 1,
  },
};

export const listEntriesIndex = cache(async (): Promise<IndexEntry[]> => {
  const db = getDB();
  const entries = await db
    .collection("entries-test")
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
      .collection(env.ENTRIES_COLLECTION_NAME)
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
      .collection(env.ENTRIES_COLLECTION_NAME)
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
    .collection(env.ENTRIES_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) });
  if (!entry) {
    throw new Error("Entry not found");
  }
  return EntrySchema.parse(entry);
});

export const HeadwordSchema = z.object({
  headword: z.string(),
  _id: ObjectIdSchema,
});

export type Headword = z.infer<typeof HeadwordSchema>;

export const getHeadword = cache(async (id: string): Promise<Headword> => {
  const db = getDB();
  const entry = await db.collection(env.ENTRIES_COLLECTION_NAME).findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        headword: true,
      },
    }
  );

  if (!entry) {
    throw new Error("Entry not found");
  }

  return HeadwordSchema.parse(entry);
});

export const ExamplesSchema = z.object({
  _id: ObjectIdSchema,
  examples: z.array(ExampleSchema),
});

export type EntryExamples = z.infer<typeof ExamplesSchema>;

export const ExpressionsSchema = z.object({
  _id: ObjectIdSchema,
  expressions: z.array(ExpressionSchema),
});

export type EntryExpressions = z.infer<typeof ExpressionsSchema>;

export const getExpressions = cache(
  async (id: string): Promise<EntryExpressions> => {
    const db = getDB();
    const result = await db
      .collection(env.ENTRIES_COLLECTION_NAME)
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { expressions: true } }
      );
    if (!result) {
      throw new Error("Entry not found");
    }
    return ExpressionsSchema.parse(result);
  }
);

export const getExamples = cache(async (id: string): Promise<EntryExamples> => {
  const db = getDB();
  const result = await db
    .collection(env.ENTRIES_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) }, { projection: { examples: true } });
  if (!result) {
    throw new Error("Entry not found");
  }
  return ExamplesSchema.parse(result);
});

export const listEntryIds = cache(async (): Promise<string[]> => {
  const db = getDB();
  const entries = await db
    .collection(env.ENTRIES_COLLECTION_NAME)
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
