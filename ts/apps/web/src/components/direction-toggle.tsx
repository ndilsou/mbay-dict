import { Link } from '@tanstack/react-router'
import { type Direction, flipDirection, directionLang } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react'

export function DirectionToggle({
  dir,
  letter,
  className,
}: {
  dir: Direction
  letter: string
  className?: string
}) {
  const flipped = flipDirection(dir)
  const lang = directionLang(dir)

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg bg-secondary/60 p-0.5',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
        {t(`dir_${dir}`, lang)}
      </span>
      <Link
        to="/$dir/index/$letter"
        params={{ dir: flipped, letter }}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon
          icon="solar:transfer-horizontal-bold-duotone"
          className="size-3.5"
        />
        {t(`dir_${flipped}`, lang)}
      </Link>
    </div>
  )
}
