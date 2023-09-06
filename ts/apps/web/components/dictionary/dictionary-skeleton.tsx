import { PageContainer } from "@/components/page-container";
import {
  LetterEntries,
  LetterEntriesSkeleton,
} from "@/components/dictionary/letter-entries";
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

export default async function DictionarySkeleton({
  language,
}: {
  language: "french" | "english";
}) {
  return (
    <PageContainer>
      <h6 id="page-top" />
      <LetterScroll
        className="hidden md:flex z-40 fixed top-1/2 transform -translate-y-1/2 right-4"
        language={language}
      />
      <AlphabetCollapsible language={language} className="block md:hidden" />
      <Alphabet language={language} className="hidden md:flex" />
      <LetterEntriesSkeleton className="mt-4" letter="-" language={language} />
      <h6 id="page-bottom" />
    </PageContainer>
  );
}
