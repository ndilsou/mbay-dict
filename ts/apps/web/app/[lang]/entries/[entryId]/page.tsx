import { Examples } from "@/components/examples";
import { Loading } from "@/components/loading";
import { PageContainer } from "@/components/page-container";
import { SoundButton } from "@/components/sound-button";
import { getEntry, type Entry, listEntryIds } from "@/lib/db";
import { langCodeToName } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackButton } from "@/components/back-button";
import {
  GrammaticalNoteSkeleton,
  GrammaticalNote,
} from "@/components/dictionary/grammatical-note";
import { Expressions } from "@/components/expressions";

export async function generateStaticParams() {
  const ids = await listEntryIds();
  return ids.map((id) => ({ entryId: id, lang: "french" }));
}

export default async function Page({
  params: { entryId, lang },
}: {
  params: { entryId: string; lang: "fr" | "en" };
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

  const translation = entry[language].translation;
  return (
    <PageContainer className="items-start justify-start prose dark:prose-invert">
      <div className="flex items-end justify-end w-full">
        <BackButton />
      </div>
      <div className="flex items-baseline">
        <h1 className="text-6xl font-bold mb-2">{entry.headword}</h1>
        {entry.soundFilename && <SoundButton filename={entry.soundFilename} />}
      </div>
      <p className="text-xl">{translation}</p>
      {entry.grammaticalNote && (
        <Suspense fallback={<GrammaticalNoteSkeleton />}>
          <GrammaticalNote language={language} entry={entry} />
        </Suspense>
      )}
      <div>
        <h3>Expressions:</h3>
        <Suspense fallback={<Loading />}>
          <Expressions entryId={entry._id} language={language} />
        </Suspense>
      </div>
      <div>
        <h3>Exemples d&apos;usage:</h3>
        <Suspense fallback={<Loading />}>
          <Examples entryId={entry._id} language={language} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
