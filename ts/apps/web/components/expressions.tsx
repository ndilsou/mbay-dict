import {
  getExamples,
  type Example,
  getExpressions,
  type Expression,
} from "@/lib/db";
import { SoundButton } from "./sound-button";
import { ExampleCard } from "./examples";

export async function Expressions({
  entryId,
  language,
}: {
  entryId: string;
  language: "french" | "english";
}) {
  const { expressions } = await getExpressions(entryId);
  return (
    <ul className="list-none pl-0 prose">
      {expressions.map((item) => (
        <li key={item._id}>
          <ExpressionCard expression={item} language={language} />
        </li>
      ))}
    </ul>
  );
}

function ExpressionCard({
  expression,
  language,
}: {
  expression: Expression;
  language: "french" | "english";
}) {
  const translation = expression[language].translation;
  return (
    <div className="border border-border rounded-lg px-2 py-2">
      <div className="flex">
        <h4 className="text-primary mt-2">{expression.mbay}</h4>
        {expression.soundFilename && (
          <SoundButton filename={expression.soundFilename} />
        )}
      </div>
      <p className="my-2 ml-2 text-muted-foreground">{translation}</p>
      {expression.example !== null && (
        <div className="flex flex-col justify-start gap-1 text-secondary-foreground">
          <span className="text-muted-foreground">Exemple:</span>
          <ExampleCard
            example={expression.example}
            language={language}
            className="bg-secondary"
          />
        </div>
      )}
    </div>
  );
}
