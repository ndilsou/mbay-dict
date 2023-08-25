import { EntryCard } from "@/components/entry-card";
import { LetterScroll } from "@/components/letter-scroll";
import { PageContainer } from "@/components/page-container";
import { LETTERS } from "@/lib/constants";
import Link from "next/link";
import * as R from "remeda";
import { SearchResult } from "../components/search-result";
import { listEntriesIndex, type IndexEntry, type Entry } from "@/lib/db";

export default function Dictionary({
  entries,
  searchTerm,
}: {
  entries: IndexEntry[];
  searchTerm?: string;
}) {
  return (
    <PageContainer>
      <h6 id="main-title" className="" />
      <LetterScroll className="z-40 fixed top-1/2 transform -translate-y-1/2 right-4" />
      {searchTerm && <SearchResult hits={entries.length} term={searchTerm} />}
      <Alphabet />
      <Entries entries={entries} />
    </PageContainer>
  );
}

function Entries({ entries }: { entries: IndexEntry[] }) {
  const groupedEntries = createGroups(entries);
  return (
    <div className="flex flex-col gap-2 mt-4">
      {groupedEntries.map((group) => (
        <LetterGroup key={group.key} group={group} />
      ))}
    </div>
  );
}

function LetterGroup({ group }: { group: { key: string; entries: IndexEntry[] }}) {
    return (
        <section key={group.key}>
          <Link href={`/#${group.key}`}>
            <h2 className="text-4xl font-bold capitalize" id={group.key}>
              {group.key}
            </h2>
          </Link>
          <div className="flex flex-col gap-2 mt-4">
            {group.entries.map((entry) => (
              <EntryCard key={entry._id} entry={entry} language="french" />
            ))}
          </div>
        </section>
    )
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

function createGroups(entries: IndexEntry[]) {
  const groups = R.groupBy(entries, (entry) => {
    const lowerCase = entry.french_translation.toLowerCase();
    const term = lowerCase.replace(/^['\(\{\[-]/, "");
    return term.charAt(0);
  });
  const groupedEntries = Object.keys(groups).map((key) => {
    return {
      key: key,
      entries: groups[key].sort((a, b) =>
        a.french_translation.localeCompare(b.french_translation),
      ),
    };
  });
  const sortedGroupedEntries = groupedEntries.sort((a, b) =>
    a.key.localeCompare(b.key),
  );
  return sortedGroupedEntries;
}
