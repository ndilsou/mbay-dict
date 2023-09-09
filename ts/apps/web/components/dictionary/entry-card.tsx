import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { languageToCode } from "@/lib/utils";
import { SoundButton } from "@/components/sound-button";
import type { IndexEntry } from "@/lib/db";
import {
  ExamplesCollapsible,
  ExamplesCollapsibleSkeleton,
} from "./examples-collapsible";
import { Skeleton } from "../ui/skeleton";
import {
  ExpressionsCollapsible,
  ExpressionsCollapsibleSkeleton,
} from "./expressions-collapsible";
import { GrammaticalNote, GrammaticalNoteSkeleton } from "./grammatical-note";
import { Suspense } from "react";

export function EntryCard({
  entry,
  language,
}: {
  entry: IndexEntry;
  language: "french" | "english";
}) {
  const translation = entry[language].translation;
  const lang = languageToCode(language);
  return (
    <Card>
      <CardHeader className="flex-row justify-start gap-4 items-center py-2">
        <Button variant="link" className="p-0">
          <Link href={`/${lang}/entries/${entry._id}`}>
            <h1 className="text-2xl font-bold">{entry.headword}</h1>
          </Link>
        </Button>
        {entry.soundFilename && <SoundButton filename={entry.soundFilename} />}
      </CardHeader>
      <CardContent>
        <p className="text-lg">{translation}</p>
        {entry.grammaticalNote && (
          <Suspense fallback={<GrammaticalNoteSkeleton />}>
            <GrammaticalNote language={language} entry={entry} />
          </Suspense>
        )}
        <ExpressionsCollapsible
          className="mt-2"
          entry={entry}
          language={language}
        />
        <ExamplesCollapsible entry={entry} language={language} />
      </CardContent>
    </Card>
  );
}

export function EntryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex-row justify-start gap-4 items-center py-2">
        <Button variant="link" className="p-0">
          <h1 className="text-2xl font-bold">
            <Skeleton className="w-20 h-[32px]" />
          </h1>
        </Button>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[18px] w-52" />
        <ExpressionsCollapsibleSkeleton className="mt-2" />
        <ExamplesCollapsibleSkeleton className="mt-2" />
      </CardContent>
    </Card>
  );
}
