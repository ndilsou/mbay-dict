import { LETTERS } from "@/lib/constants";
import { cn, languageToCode } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowDownToLine, ArrowUpToLine, Home } from "lucide-react";
import { ScrollToButton } from "./scroll-to-button";

export function LetterScroll({
  language = "french",
  className,
}: {
  language: "french" | "english";
  className?: string;
}) {
  const lang = languageToCode(language);
  return (
    <ol
      className={cn(
        "flex flex-col items-center justify-center gap-1",
        className
      )}
    >
      <li>
        <Link href="#page-top">
          <Button variant="link" size="sm" className="h-4">
            <ArrowUpToLine />
          </Button>
        </Link>
      </li>
      {LETTERS.map((letter) => (
        <li key={letter}>
          <Link key={letter} href={`/${lang}/index/${letter}`}>
            <Button variant="link" size="sm" className="h-4">
              <span className="text-lg">{letter}</span>
            </Button>
          </Link>
        </li>
      ))}
      <li>
        <Link href="#page-bottom">
          <Button variant="link" size="sm" className="h-4">
            <ArrowDownToLine />
          </Button>
        </Link>
      </li>
    </ol>
  );
}
