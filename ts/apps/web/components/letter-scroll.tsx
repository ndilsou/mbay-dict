import { LETTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

export function LetterScroll({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      {LETTERS.map((letter) => (
        <Button variant="link" size="sm" className="h-4">
          <Link key={letter} href={`/#${letter}`}>
            <span className="text-lg">{letter}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
