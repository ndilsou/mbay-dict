import { EntryCard } from "@/components/entry-card";
import { LETTERS } from "@/lib/constants";
import Link from "next/link";
import * as R from "remeda";
import { listEntriesIndex, type IndexEntry } from "@/lib/db";
import Dictionary from "@/components/dictionary";

export default async function Home() {
  const entries = await listEntriesIndex();

  return <Dictionary entries={entries} />;
}
