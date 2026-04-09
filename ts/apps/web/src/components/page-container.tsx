import { cn } from '@/lib/utils'

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-10 animate-fade-in',
        className,
      )}
    >
      {children}
    </div>
  )
}
