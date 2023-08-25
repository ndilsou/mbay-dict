import { cn } from "@/lib/utils";
import LoadingCircle from "./loading-circle";

export function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center gap-2",
        className,
      )}
    >
      <LoadingCircle />
      <span>Chargement en cours...</span>
    </div>
  );
}
