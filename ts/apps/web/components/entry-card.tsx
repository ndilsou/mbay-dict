import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { languageToCode } from "@/lib/utils";
import { SoundButton } from "./sound-button";
import type { IndexEntry } from "@/lib/db";
import { ExamplesCollapsible } from "./examples-collapsible";

export function EntryCard({
  entry,
  language,
}: {
  entry: IndexEntry;
  language: "french" | "english";
}) {
  let translation: string;

  if (language === "french") {
    translation = entry.french_translation;
  } else {
    translation = entry.english_translation;
  }

  return (
    <Card>
      <CardHeader className="flex-row justify-start gap-4 items-center py-2">
        <Button variant="link" className="p-0">
          <Link href={`/entries/${languageToCode(language)}/${entry._id}`}>
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
