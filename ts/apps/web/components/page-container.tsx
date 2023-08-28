import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-start py-10 px-5 max-w-5xl bg-background mx-auto min-h-full",
        className
      )}
    >
      {children}
    </div>
  );
}
