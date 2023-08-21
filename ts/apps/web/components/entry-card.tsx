import { type Entry } from "@/lib/data";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Volume1 } from "lucide-react";
import { Button } from "./ui/button";
import { languageToCode } from "@/lib/utils";
import { SoundButton } from "./sound-button";

export function EntryCard({
  entry,
  language,
}: {
  entry: Entry;
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
      <CardHeader className="flex-row justify-start gap-4 items-center">
        <Button variant="link" className="p-0">
          <Link href={`/entries/${languageToCode(language)}/${entry.id}`}>
            <h1 className="text-2xl font-bold">{entry.headword}</h1>
          </Link>
        </Button>
        {entry.sound_filename && (
          <SoundButton filename={entry.sound_filename} />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-lg">{translation}</p>
      </CardContent>
    </Card>
  );
}
