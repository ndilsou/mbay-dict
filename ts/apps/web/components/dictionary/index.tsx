import { LetterScroll } from "@/components/dictionary/letter-scroll";
import { PageContainer } from "@/components/page-container";
import { SearchResult } from "../search-result";
import { type IndexEntry } from "@/lib/db";
import { Alphabet } from "./alphabet";
import { Entries } from "./entries";

export default function Dictionary({
  entries,
  searchTerm,
}: {
  entries: IndexEntry[];
  searchTerm?: string;
}) {
  console.log("load starting", entries.length, "items");
  return (
    <PageContainer>
      <h6 id="main-title" className="" />
      <LetterScroll className="z-40 fixed top-1/2 transform -translate-y-1/2 right-4" />
      {searchTerm && <SearchResult hits={entries.length} term={searchTerm} />}
      <Alphabet />
      <Entries className="mt-4" entries={entries} />
    </PageContainer>
  );
}
