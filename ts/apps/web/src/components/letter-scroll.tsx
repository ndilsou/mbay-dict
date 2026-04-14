import { Link } from '@tanstack/react-router'
import { LETTERS, type Direction } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ChevronsUp, ChevronsDown } from 'lucide-react'

export function LetterScroll({
  dir = 'mb-fr',
  activeLetter,
  className,
}: {
  dir?: Direction
  activeLetter?: string
  className?: string
}) {
  return (
    <nav
      aria-label="Letter navigation"
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 py-2 px-1 shadow-sm',
        className,
      )}
    >
      <a
        href="#page-top"
        className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors"
      >
        <ChevronsUp className="size-3.5" />
      </a>
      {LETTERS.map((letter) => {
        const isActive =
          activeLetter?.toLowerCase() === letter.toLowerCase()
        return (
          <Link
            key={letter}
            to="/$dir/index/$letter"
            params={{ dir, letter }}
            className={cn(
              'flex items-center justify-center size-6 rounded-md text-xs font-medium capitalize transition-all',
              isActive
                ? 'bg-primary text-primary-foreground scale-110'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            )}
          >
            {letter}
          </Link>
        )
      })}
      <a
        href="#page-bottom"
        className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors"
      >
        <ChevronsDown className="size-3.5" />
      </a>
    </nav>
  )
}
