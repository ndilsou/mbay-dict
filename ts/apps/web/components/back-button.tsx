"use client";

import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <Button variant="outline" onClick={() => router.back()}>
      <Undo />
      <span className="ml-1">Retour</span>
    </Button>
  );
}
