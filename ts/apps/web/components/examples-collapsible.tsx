import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import type { IndexEntry } from "@/lib/db";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Examples } from "./examples";
import { Separator } from "./ui/separator";

export function ExamplesCollapsible({
  entry,
  language,
  className,
}: {
  entry: IndexEntry;
  language: "french" | "english";
  className?: string;
}) {
  const count = entry.examples.length;
  if (count === 0) {
    return (
      <div className={cn(className)}>
        <Separator />
        <span className="text-muted-foreground pt-1">
          Aucun example pour cet entree
        </span>
      </div>
    );
  }

  let label: string;
  if (count === 1) {
    label = "Voir l'example";
  } else {
    label = `Voir les ${count} examples`;
  }

  return (
    <Collapsible className={cn(className)}>
      <Separator />
      <div className="flex justify-start items-center gap-1 pt-1">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 p-1"
          >
            <span>{label}</span>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="gap-1 mt-2">
        <Examples entryId={entry._id} language={language} />
      </CollapsibleContent>
    </Collapsible>
  );
}
