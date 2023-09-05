"use client";

import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const placeholder = "Cherchez un mot...";
  function handleSubmit(e: React.FormEvent<SearchFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = form.elements.search.value;
    if (!q) return;

    router.push(`/s/${q}`);
    form.elements.search.value = "";
  }

  return (
    <form
      className={cn("flex w-full  max-w-sm items-center space-x-2", className)}
      onSubmit={handleSubmit}
    >
      <Input name="search" type="search" placeholder={placeholder} />
      <Button type="submit">
        <Search />
      </Button>
    </form>
  );
}
interface FormElements extends HTMLFormControlsCollection {
  search: HTMLInputElement;
}
interface SearchFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}
