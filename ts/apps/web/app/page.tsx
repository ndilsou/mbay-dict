import { EntryCard } from "@/components/entry-card";
import { LetterScroll } from "@/components/letter-scroll";
import { PageContainer } from "@/components/page-container";
import { LETTERS } from "@/lib/constants";
import { entriesDataset, type Entry } from "@/lib/data";
import Link from "next/link";
import * as R from "remeda";
import { SearchResult } from "../components/search-result";

export default function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const queryParams = new URLSearchParams(searchParams);

  const term = queryParams.get("q")?.toLowerCase();
  let entries: Entry[];
  if (term) {
    entries = entriesDataset.filter((entry) => {
      const text = entry.french_translation.toLowerCase();
      return text.includes(term);
    });
  } else {
    entries = entriesDataset;
  }

  return (
    <PageContainer>
      <h6 id="main-title" className="" />
      <LetterScroll className="z-40 fixed top-1/2 transform -translate-y-1/2 right-4" />
      {term && <SearchResult hits={entries.length} term={term} />}
      <Alphabet />
      <Entries entries={entries} />
    </PageContainer>
  );
}

function Entries({ entries }: { entries: Entry[] }) {
  const groups = R.groupBy(entries, (entry) => {
    const lowerCase = entry.french_translation.toLowerCase();
    const term = lowerCase.replace(/^['\(\{\[-]/, "");
    return term.charAt(0);
  });
  const groupedEntries = Object.keys(groups).map((key) => {
    return {
      key: key,
      entries: groups[key].sort((a, b) =>
        a.french_translation.localeCompare(b.french_translation)
      ),
    };
  });
  const sortedGroupedEntries = groupedEntries.sort((a, b) =>
    a.key.localeCompare(b.key)
  );

  return (
    <div className="flex flex-col gap-2 mt-4">
      {sortedGroupedEntries.map((group) => (
        <section key={group.key}>
          <Link href={`/#${group.key}`}>
            <h2 className="text-4xl font-bold capitalize" id={group.key}>
              {group.key}
            </h2>
          </Link>
          <div className="flex flex-col gap-2 mt-4">
            {group.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} language="french" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Alphabet() {
  return (
    <div className="flex flex-wrap justify-center mt-8 gap-4">
      {LETTERS.map((letter) => (
        <Link
          className="w-12 flex justify-center items-center p-4 bg-primary rounded-lg hover:bg-primary/50 capitalize text-primary-foreground"
          key={letter}
          href={`#${letter}`}
        >
          {letter}
        </Link>
      ))}
    </div>
  );
}
