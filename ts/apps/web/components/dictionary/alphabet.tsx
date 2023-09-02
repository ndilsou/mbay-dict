import { INDEX_KEYS } from "@/lib/constants";
import { cn, languageToCode } from "@/lib/utils";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";

export function Alphabet({
  language = "french",
  className,
}: {
  language?: "french" | "english";
  className?: string;
}) {
  const lang = languageToCode(language);
  return (
    <div className={cn("flex flex-wrap justify-center mt-8 gap-4", className)}>
      {INDEX_KEYS.map((letter) => (
        <Letter key={letter} lang={lang} letter={letter}></Letter>
      ))}
    </div>
  );
}

function Letter(props: { lang: string; letter: string }) {
  let extraClasses = "";
  let label = props.letter;
  if (props.letter === "MISC" && props.lang === "fr") {
    label = "Autres";
    extraClasses = "text-sm";
  }

  return (
    <Link
      className={cn(
        "w-14 flex justify-center items-center p-4 bg-primary rounded-lg hover:bg-primary/50 capitalize text-primary-foreground",
        extraClasses
      )}
      href={`/${props.lang}/index/${props.letter}`}
    >
      {label}
    </Link>
  );
}

export function AlphabetCollapsible({
  language = "french",
  className,
}: {
  language?: "french" | "english";
  className?: string;
}) {
  let label: string;
  if (language === "french") {
    label = "Voir L'index";
  } else if (language === "english") {
    label = "See Index";
  } else {
    throw new Error(`Unknown language: ${language}`);
  }

  return (
    <div className={className}>
      <Collapsible>
        <div className="flex justify-center items-center gap-1 pt-1">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="flex items-center gap-1 p-1"
            >
              <span>{label}</span>
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <Alphabet language={language} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
