import { getExamples, type Example } from "@/lib/db";
import { SoundButton } from "./sound-button";
import { cn } from "@/lib/utils";

export async function Examples({
  entryId,
  language,
}: {
  entryId: string;
  language: "french" | "english";
}) {
  const { examples } = await getExamples(entryId);
  return (
    <ul className="list-none pl-0 prose">
      {examples.map((example) => (
        <li key={example._id}>
          <ExampleCard example={example} language={language} />
        </li>
      ))}
    </ul>
  );
}

export function ExampleCard({
  example,
  language,
  className,
}: {
  example: Example;
  language: "french" | "english";
  className?: string;
}) {
  const translation = example[language].translation;
  return (
    <div className={cn("border border-border rounded-lg px-2 py-2", className)}>
      <div className="flex">
        <h4 className="text-primary mt-2">{example.mbay}</h4>
        {example.soundFilename && (
          <SoundButton filename={example.soundFilename} />
        )}
      </div>
      <p className="my-2 ml-2 text-muted-foreground">{translation}</p>
    </div>
  );
}
