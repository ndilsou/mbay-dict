import Dictionary from "@/components/dictionary";
import { searchEntries } from "@/lib/db";

export default async function Page({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) {
  const decodedSearchTerm = decodeURIComponent(searchTerm);

  const entries = await searchEntries({ searchTerm: decodedSearchTerm });

  return <Dictionary entries={entries} searchTerm={decodedSearchTerm} />;
}
