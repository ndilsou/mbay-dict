import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { TooltipText } from "./tooltip-text";
import { languageToCode } from "@/lib/utils";

export function SearchResult({
  language,
  hits,
  term,
}: {
  language: string;
  hits: number;
  term: string;
}) {
  const lang = languageToCode(language);
  return (
    <div className="flex items-center justify-center w-full gap-2">
      <h2>
        {hits} entrées trouvées pour &quot;{term}&quot;
      </h2>
      <Link href={`/${lang}/index/a`}>
        <TooltipText text="retour a l'index">
          <Button variant="ghost" size="icon">
            <SearchX />
          </Button>
        </TooltipText>
      </Link>
    </div>
  );
}
