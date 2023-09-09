import { getHeadword, type Headword, type IndexEntry } from "@/lib/db";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import type { ReactNode } from "react";
import { langCodeToName, languageToCode } from "@/lib/utils";

export async function GrammaticalNote({
  language,
  entry,
}: {
  language: "french" | "english";
  entry: IndexEntry;
}) {
  if (!entry.grammaticalNote) {
    throw new Error("Grammatical note is undefined");
  }

  const gramNoteLabel =
    language === "french" ? "Note grammaticale" : "Grammatical note";
  let gramNote: string | ReactNode[] = entry.grammaticalNote?.[language];

  if (entry.relatedWord) {
    if (entry.relatedWord.id) {
      const relatedWord = await getHeadword(entry.relatedWord.id);
      const href = `/${languageToCode(language)}/entries/${relatedWord._id}`;
      gramNote = replaceWithJSX(
        gramNote.replace("^^", "'^^'"),
        "^^",
        <Link href={href}>
          <span className="text-foreground hover:underline font-bold">
            {relatedWord.headword}
          </span>
        </Link>
      );
    } else if (entry.relatedWord.text) {
      const relatedWordText = entry.relatedWord.text;
      gramNote = gramNote.replace("^^", `'${relatedWordText}'`);
    }
  }

  return (
    <div className="text-sm lg:text-base text-muted-foreground flex justify-start items-baseline gap-2">
      <span className="font-bold">{gramNoteLabel}:</span>
      <p>{gramNote}</p>
    </div>
  );
}

export function GrammaticalNoteSkeleton() {
  return (
    <div className="text-sm text-muted-foreground flex justify-start items-baseline gap-2">
      <Skeleton className="w-20 h-[32px]" />
      <Skeleton className="w-52 h-[18px]" />
    </div>
  );
}

function replaceWithJSX(
  str: string,
  target: string,
  jsx: ReactNode
): (string | ReactNode)[] {
  const parts = str.split(target);
  let result: (string | ReactNode)[] = [];
  parts.forEach((part, i) => {
    result.push(part);
    if (i < parts.length - 1) {
      result.push(jsx);
    }
  });
  return result;
}
