import { LetterScroll } from "@/components/dictionary/letter-scroll";
import { PageContainer } from "@/components/page-container";
import { SearchResult } from "../search-result";
import { type IndexEntry } from "@/lib/db";
import { Alphabet, AlphabetCollapsible } from "./alphabet";
import { Entries } from "./entries";
import { langCodeToName } from "@/lib/utils";

export default function Dictionary({
  lang = "fr",
  entries,
  searchTerm,
}: {
  lang?: "fr" | "en";
  entries: IndexEntry[];
  searchTerm?: string;
}) {
  const language = langCodeToName(lang);

  return (
    <PageContainer>
      <h6 id="main-title" className="" />
      <LetterScroll
        className="hidden md:flex z-40 fixed top-1/2 transform -translate-y-1/2 right-4"
        language={language}
      />
      {searchTerm && <SearchResult hits={entries.length} term={searchTerm} />}
      <AlphabetCollapsible language={language} className="block md:hidden" />
      <Alphabet language={language} className="hidden md:flex" />
      <Entries language={language} className="mt-4" entries={entries} />
    </PageContainer>
  );
}
