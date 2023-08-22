import { PageContainer } from "@/components/page-container";
import { SoundButton } from "@/components/sound-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import {
//   entriesDataset,
//   examplesDataset,
//   type Entry,
//   type Example,
// } from "@/lib/data";
import { getEntry, type Entry, type Example } from "@/lib/db";
import { langCodeToName } from "@/lib/utils";
import { Undo } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
  params: { entryId, lang },
}: {
  params: { entryId: string; lang: string };
}) {
  let language: "french" | "english";
  try {
    language = langCodeToName(lang);
  } catch (e) {
    notFound();
  }

  const entry: Entry = await getEntry(entryId);
  if (!entry) {
    notFound();
  }

  let translation: string;
  if (language === "french") {
    translation = entry.french_translation;
  } else {
    translation = entry.english_translation;
  }
  return (
    <PageContainer className="items-start justify-start prose dark:prose-invert">
      <div className="flex items-end justify-end w-full">
        <Link href="/">
          <Button variant="outline">
            <Undo />
            <span className="ml-1">Retour</span>
          </Button>
        </Link>
      </div>
      <div className="flex items-baseline">
        <h1 className="text-6xl font-bold mb-2">{entry.headword}</h1>
        {entry.sound_filename && (
          <SoundButton filename={entry.sound_filename} />
        )}
      </div>
      <p className="text-xl">{translation}</p>
      <div>
        <h3 className="">Exemples d&apos;usage:</h3>
        <Examples examples={entry.examples} language={language} />
      </div>
    </PageContainer>
  );
}

async function Examples({
  examples,
  language,
}: {
  examples: Example[];
  language: "french" | "english";
}) {
  // const examples = await getExamples(entryId);
  return (
    <ul className="list-none pl-0">
      {examples.map((example) => (
        <li key={example._id}>
          <ExampleCard example={example} language={language} />
        </li>
      ))}
    </ul>
  );
}

function ExampleCard({
  example,
  language,
}: {
  example: Example;
  language: "french" | "english";
}) {
  let translation;
  if (language === "french") {
    translation = example.french_translation;
  } else {
    translation = example.english_translation;
  }

  return (
    <div className="border border-border rounded-lg px-2 py-2">
      <div className="flex">
        <h4 className="text-primary mt-2">{example.mbay}</h4>
        {example.sound_filename && (
          <SoundButton filename={example.sound_filename} />
        )}
      </div>
      <p className="my-2 ml-2 text-muted-foreground">{translation}</p>
    </div>
  );
}

// async function getEntry(id: number): Promise<Entry | null> {
//   const entry = entriesDataset.filter((entry) => entry.id === id).at(0);
//   if (!entry) {
//     return null;
//   }
//   return entry;
// }

// async function getExamples(id: number): Promise<Example[]> {
//   return examplesDataset.filter((example) => example.entry_id === id);
// }
