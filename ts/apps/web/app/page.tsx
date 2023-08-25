import { listEntriesIndex } from "@/lib/db";
import Dictionary from "@/components/dictionary";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const entries = await listEntriesIndex();

  return <Dictionary entries={entries} />;
}
