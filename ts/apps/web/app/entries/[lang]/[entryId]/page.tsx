import { Examples } from "@/components/examples";
import { PageContainer } from "@/components/page-container";
import { SoundButton } from "@/components/sound-button";
import { Button } from "@/components/ui/button";
import { getEntry, type Entry } from "@/lib/db";
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
        <Examples entryId={entry._id} language={language} />
      </div>
    </PageContainer>
  );
}
