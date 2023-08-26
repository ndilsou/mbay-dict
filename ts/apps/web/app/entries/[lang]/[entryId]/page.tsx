import { Examples } from "@/components/examples";
import { Loading } from "@/components/loading";
import { PageContainer } from "@/components/page-container";
import { SoundButton } from "@/components/sound-button";
import { getEntry, type Entry, listEntryIds } from "@/lib/db";
import { langCodeToName } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackButton } from "../../../../components/back-button";

// Return a list of `params` to populate the [lang] and [entryId] dynamic segment
export async function generateStaticParams() {
  const ids = await listEntryIds();
  return ids.map((id) => ({ params: { entryId: id, lang: "french" } }));
}

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
        <BackButton />
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
        <Suspense fallback={<Loading />}>
          <Examples entryId={entry._id} language={language} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
