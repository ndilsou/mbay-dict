import { type IndexEntry } from "@/lib/db";
import { cn } from "@/lib/utils";
import { LetterGroup } from "./letter-group";
import * as R from "remeda";

export function Entries({
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
        a.french_translation.localeCompare(b.french_translation)
      ),
    };
  });
  const sortedGroupedEntries = groupedEntries.sort((a, b) =>
    a.key.localeCompare(b.key)
  );
  return sortedGroupedEntries;
}
