import { redirect } from "next/navigation";

export default function Page({
  params: { letter },
}: {
  params: { letter: string };
}) {
  return (
    <main className="flex min-h-page flex-col items-center justify-start p-24 max-w-5xl mx-auto">
      <h1 className="text-6xl font-bold text-center">
        Lettre {letter.toUpperCase()}
      </h1>
        <div>
            
        </div>
    </main>
  );
}
