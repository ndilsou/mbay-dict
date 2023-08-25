import { getExamples, type Example } from "@/lib/db";
import { SoundButton } from "./sound-button";

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

function ExampleCard({
  example,
  language,
}: {
  example: Example;
  language: "french" | "english";
}) {
  let translation;
  if (language === "french") {
    translation = example.french_translation;
  } else {
    translation = example.english_translation;
  }

  return (
    <div className="border border-border rounded-lg px-2 py-2">
      <div className="flex">
        <h4 className="text-primary mt-2">{example.mbay}</h4>
        {example.sound_filename && (
          <SoundButton filename={example.sound_filename} />
        )}
      </div>
      <p className="my-2 ml-2 text-muted-foreground">{translation}</p>
    </div>
  );
}
