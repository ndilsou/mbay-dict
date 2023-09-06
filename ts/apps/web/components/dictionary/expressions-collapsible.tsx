import { Examples } from "@/components/examples";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { IndexEntry } from "@/lib/db";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { Suspense } from "react";
import { Expressions } from "../expressions";

export async function ExpressionsCollapsible({
  entry,
  language,
  className,
}: {
  entry: IndexEntry;
  language: "french" | "english";
  className?: string;
  children?: React.ReactNode;
}) {
  const count = entry.expressions.length;
  if (count === 0) {
    return (
      <div className={cn(className)}>
        <Separator />
        <div className="py-2">
          <span className="text-muted-foreground">
            Aucune expressions pour ce mot
          </span>
        </div>
      </div>
    );
  }

  let label: string;
  if (count === 1) {
    label = "Voir l'expression";
  } else {
    label = `Voir les ${count} expressions`;
  }

  return (
    <Collapsible className={cn(className)}>
      <Separator />
      <div className="flex justify-start items-center gap-1 py-1">
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
        <Suspense fallback={<Loading />}>
          <Expressions entryId={entry._id} language={language} />
        </Suspense>
      </CollapsibleContent>
    </Collapsible>
  );
}

export async function ExpressionsCollapsibleSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <Separator />
      <Button variant="ghost" size="sm" className="flex items-center gap-1 p-1">
        <span>
          <Skeleton className="w-[120px] h-[20px]" />
        </span>
        <ChevronsUpDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
