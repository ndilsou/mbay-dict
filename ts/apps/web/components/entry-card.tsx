import { type Entry } from "@/lib/data";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Volume1 } from "lucide-react";
import { Button } from "./ui/button";

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
          <Link href={`/entries/${entry.id}`}>
            <h1 className="text-2xl font-bold">{entry.headword}</h1>
          </Link>
        </Button>
        <Button variant="ghost" className="text-muted-foreground" size="icon">
          <Volume1 />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{translation}</p>
      </CardContent>
    </Card>
  );
}
