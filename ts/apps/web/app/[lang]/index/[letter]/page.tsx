import { PageContainer } from "@/components/page-container";
import { LetterEntries } from "@/components/dictionary/letter-entries";
import {
  Alphabet,
  AlphabetCollapsible,
} from "@/components/dictionary/alphabet";
import {
  INDEX_KEYS,
  LETTERS,
  type IndexKey,
  IndexKeySchema,
} from "@/lib/constants";
import { langCodeToName } from "@/lib/utils";
import { notFound } from "next/navigation";
import { LetterScroll } from "@/components/dictionary/letter-scroll";

// Return a list of `params` to populate the [lang] and [entryId] dynamic segment
export async function generateStaticParams() {
  const fr = INDEX_KEYS.map((letter) => ({ letter, lang: "french" }));
  const en = INDEX_KEYS.map((letter) => ({ letter, lang: "en" }));
  return [...fr, ...en];
}

export default async function IndexAtLetter({
  params: { lang, letter },
}: {
  params: {
    lang: "fr" | "en";
    letter: IndexKey;
  };
}) {
  let language: "french" | "english";
  try {
    language = langCodeToName(lang);
  } catch (e) {
    notFound();
  }

  return (
    <PageContainer>
      <h6 id="page-top" />
      <LetterScroll
        className="hidden md:flex z-40 fixed top-1/2 transform -translate-y-1/2 right-4"
        language={language}
      />
      <AlphabetCollapsible language={language} className="block md:hidden" />
      <Alphabet language={language} className="hidden md:flex" />
      <LetterEntries className="mt-4" letter={letter} language={language} />
      <h6 id="page-bottom" />
    </PageContainer>
  );
}
