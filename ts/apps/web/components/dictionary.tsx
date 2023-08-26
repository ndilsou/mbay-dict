import { EntryCard } from "@/components/entry-card";
import { LetterScroll } from "@/components/letter-scroll";
import { PageContainer } from "@/components/page-container";
import Link from "next/link";
import * as R from "remeda";
import { SearchResult } from "../components/search-result";
import { type IndexEntry } from "@/lib/db";
import { Alphabet } from "./alphabet";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Loading } from "./loading";

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
      {/* <Suspense fallback={<Loading />}> */}
        <Entries className="mt-4" entries={entries} />
      {/* </Suspense> */}
    </PageContainer>
  );
}

function Entries({
  entries,
  className,
}: {
  entries: IndexEntry[];
  className?: string;
}) {
  const groupedEntries = createGroups(entries);
  console.log("grouping complete", groupedEntries.length, "groups");
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {groupedEntries.map((group) => (
        <LetterGroup key={group.key} group={group} />
      ))}
    </div>
  );
}

function LetterGroup({
  group,
}: {
  group: { key: string; entries: IndexEntry[] };
}) {
  return (
    <section key={group.key}>
      <Link href={`/#${group.key}`}>
        <h2 className="text-4xl font-bold capitalize" id={group.key}>
          {group.key}
        </h2>
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        {/* <Suspense fallback={<Loading />}> */}
          <EntryGroup entries={group.entries} />
          {/* {group.entries.map((entry) => (
          <EntryCard key={entry._id} entry={entry} language="french" />
        ))} */}
        {/* </Suspense> */}
      </div>
    </section>
  );
}

function EntryGroup({
  entries,
  className,
}: {
  entries: IndexEntry[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {entries.map((entry) => (
        <EntryCard key={entry._id} entry={entry} language="french" />
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
