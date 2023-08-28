import { INDEX_KEYS, LETTERS } from "@/lib/constants";
import { cn, languageToCode } from "@/lib/utils";
import Link from "next/link";

export function Alphabet({
  language = "french",
}: {
  language?: "french" | "english";
}) {
  const lang = languageToCode(language);
  return (
    <div className="flex flex-wrap justify-center mt-8 gap-4">
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
