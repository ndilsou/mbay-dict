import { listEntriesIndex } from "@/lib/db";
import Dictionary from "@/components/dictionary";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/fr/index/a");
  // const entries = await listEntriesIndex();

  // return <Dictionary entries={entries} />;
}
