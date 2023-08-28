import { z } from "zod";

export const LETTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;

export const INDEX_KEYS = [...LETTERS, "MISC"] as const;
export const IndexKeySchema = z.enum(INDEX_KEYS);
export type IndexKey = z.infer<typeof IndexKeySchema>;
