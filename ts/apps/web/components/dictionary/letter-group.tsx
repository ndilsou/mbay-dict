import type { IndexEntry } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EntryCard, EntryCardSkeleton } from "./entry-card";
import { Suspense } from "react";

export function LetterGroup({
  language,
  group,
}: {
  language: "french" | "english";
  group: { key: string; entries: IndexEntry[] };
}) {
  let label = group.key;
  if (group.key === "MISC" && language === "french") {
    label = "Autres";
  }
  return (
    <section key={group.key}>
      <Link href={`/#${group.key}`}>
        <h2 className="text-4xl font-bold capitalize" id={group.key}>
          {label}
        </h2>
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        <Suspense fallback={<EntryGroupSkeleton />}>
          <EntryGroup entries={group.entries} language={language} />
        </Suspense>
      </div>
    </section>
  );
}

async function EntryGroup({
  entries,
  language,
  className,
}: {
  entries: IndexEntry[];
  language: "french" | "english";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {entries.map((entry) => (
        <EntryCard key={entry._id} entry={entry} language={language} />
      ))}
    </div>
  );
}

export function EntryGroupSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <EntryCardSkeleton />
      <EntryCardSkeleton />
      <EntryCardSkeleton />
    </div>
  );
}
