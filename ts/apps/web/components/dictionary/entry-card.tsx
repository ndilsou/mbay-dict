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
        {entry.sound_filename && (
          <SoundButton filename={entry.sound_filename} />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-lg">{translation}</p>
        <ExamplesCollapsible
          className="mt-2"
          entry={entry}
          language={language}
        />
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
        {/* <p className="text-lg"> */}
        <Skeleton className="h-[18px] w-52" />
        {/* </p> */}
        <ExamplesCollapsibleSkeleton className="mt-2" />
      </CardContent>
    </Card>
  );
}
