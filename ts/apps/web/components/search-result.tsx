import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { TooltipText } from "./tooltip-text";

export function SearchResult({ hits, term }: { hits: number; term: string }) {
  return (
    <div className="flex items-center justify-center w-full gap-2">
      <h2>
        {hits} entrées trouvées pour &quot;{term}&quot;
      </h2>
      <Link href="/">
        <TooltipText text="retour a l'index">
          <Button variant="ghost" size="icon">
            <SearchX />
          </Button>
        </TooltipText>
      </Link>
    </div>
  );
}
