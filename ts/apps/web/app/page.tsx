import { EntryCard } from "@/components/entry-card";
import { LetterScroll } from "@/components/letter-scroll";
import { LETTERS } from "@/lib/constants";
import { entries, type Entry } from "@/lib/data";
import Link from "next/link";
import * as R from "remeda";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-start p-24 max-w-5xl mx-auto">
      <LetterScroll className="z-40 fixed top-1/2 transform -translate-y-1/2 right-4" />
      <h1 className="text-6xl font-bold text-center">
        Dictionnaire Mbay-Français
      </h1>
      <div className="flex flex-wrap justify-center mt-8 gap-4">
        {LETTERS.map((letter) => (
          <Link
            className="w-12 flex justify-center items-center p-4 bg-primary rounded-lg hover:bg-primary/50 capitalize text-primary-foreground"
            key={letter}
            href={`/french-mbay/${letter}`}
          >
            {letter}
          </Link>
        ))}
      </div>
      <Entries entries={entries} />
    </div>
  );
}

function Entries({ entries }: { entries: Entry[] }) {
  const groups = R.groupBy(entries, (entry) =>
    entry.french_translation.toLowerCase().charAt(0)
  );
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
