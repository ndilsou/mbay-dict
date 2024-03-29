import { listEntriesAtLetter, type IndexEntry } from "@/lib/db";
import { cn } from "@/lib/utils";
import { LetterGroup, LetterGroupSkeleton } from "./letter-group";
import { IndexKeySchema, type IndexKey } from "@/lib/constants";
import { notFound } from "next/navigation";

export async function LetterEntries({
  letter,
  language,
  className,
}: {
  letter: IndexKey;
  language: "french" | "english";
  className?: string;
}) {
  if (!IndexKeySchema.safeParse(letter).success) {
    notFound();
  }

  const entries = await listEntriesAtLetter({
    letter,
    language,
  });

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <LetterGroup
        language={language}
        group={{
          key: letter,
          entries,
        }}
      />
    </div>
  );
}

export function LetterEntriesSkeleton({
  letter,
  language,
  className,
}: {
  letter: string;
  language: "french" | "english";
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <LetterGroupSkeleton label={letter} />
    </div>
  );
}
