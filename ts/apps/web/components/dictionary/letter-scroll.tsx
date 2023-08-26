import { LETTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { Home } from "lucide-react";

export function LetterScroll({ className }: { className?: string }) {
  return (
    <ol
      className={cn(
        "flex flex-col items-center justify-center gap-1",
        className
      )}
    >
      <li>
        <Link key="home" href="#main-title">
          <Button variant="link" size="sm" className="h-4">
            <Home />
          </Button>
        </Link>
      </li>
      {LETTERS.map((letter) => (
        <li key={letter}>
          <Link key={letter} href={`#${letter}`}>
            <Button variant="link" size="sm" className="h-4">
              <span className="text-lg">{letter}</span>
            </Button>
          </Link>
        </li>
      ))}
    </ol>
  );
}
