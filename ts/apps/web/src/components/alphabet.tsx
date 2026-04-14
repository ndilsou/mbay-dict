import { Link } from '@tanstack/react-router'
import { LETTERS, directionLang, type Direction } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { t } from '@/lib/i18n'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function Alphabet({
  dir = 'mb-fr',
  letters,
  className,
  activeLetter,
}: {
  dir?: Direction
  letters?: string[]
  className?: string
  activeLetter?: string
}) {
  const available = letters ?? [...LETTERS]

  return (
    <div
      className={cn(
        'flex flex-wrap justify-center gap-1.5 md:gap-2',
        className,
      )}
    >
      {available.map((letter) => {
        const isActive =
          activeLetter?.toLowerCase() === letter.toLowerCase()
        return (
          <Link
            key={letter}
            to="/$dir/index/$letter"
            params={{ dir, letter }}
            className={cn(
              'inline-flex items-center justify-center size-10 rounded-lg text-sm font-medium capitalize transition-all duration-150 md:size-11 md:text-base',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'bg-secondary/70 text-secondary-foreground hover:bg-primary/10 hover:text-primary active:scale-95',
            )}
          >
            {letter}
          </Link>
        )
      })}
    </div>
  )
}

export function AlphabetCollapsible({
  dir = 'mb-fr',
  letters,
  className,
  activeLetter,
}: {
  dir?: Direction
  letters?: string[]
  className?: string
  activeLetter?: string
}) {
  const [open, setOpen] = useState(false)
  const lang = directionLang(dir)
  const label = t('see_index', lang)

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mx-auto flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            'size-4 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open
            ? 'grid-rows-[1fr] opacity-100 mt-3'
            : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <Alphabet dir={dir} letters={letters} activeLetter={activeLetter} />
        </div>
      </div>
    </div>
  )
}
