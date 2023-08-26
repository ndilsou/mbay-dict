import { LETTERS } from "@/lib/constants";
import Link from "next/link";

export function Alphabet() {
  return (
    <div className="flex flex-wrap justify-center mt-8 gap-4">
      {LETTERS.map((letter) => (
        <Link
          className="w-12 flex justify-center items-center p-4 bg-primary rounded-lg hover:bg-primary/50 capitalize text-primary-foreground"
          key={letter}
          href={`#${letter}`}
        >
          {letter}
        </Link>
      ))}
    </div>
  );
}
