export default function Page({
  params: { entryId },
}: {
  params: { entryId: string };
}) {
  return (
    <main className="flex min-h-page flex-col items-center justify-start p-24 max-w-5xl mx-auto">
      <h1 className="text-6xl font-bold text-center">{entryId}</h1>
      <div></div>
    </main>
  );
}
