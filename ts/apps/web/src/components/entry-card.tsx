import { Link } from '@tanstack/react-router'
import { type Direction, directionMeta } from '@/lib/constants'
import { SoundButton } from './sound-button'
import type { EntryListItem } from '@/server/entries'
import { env } from '@/env'
import { ChevronRight } from 'lucide-react'

export function EntryCard({
  entry,
  direction = 'mb-fr',
}: {
  entry: EntryListItem
  direction?: Direction
  language?: string // kept for compat, ignored
}) {
  const meta = directionMeta(direction)

  // Determine heading and subtext based on direction
  let heading: string
  let subtext: string

  if (meta.source === 'mbay') {
    heading = entry.headword
    subtext = meta.target === 'french' ? entry.french : entry.english
  } else {
    // reverse: source is fr/en, target is mbay
    heading = meta.source === 'french' ? entry.french : entry.english
    subtext = entry.headword
  }

  return (
    <Link
      to="/entries/$entryId"
      params={{ entryId: String(entry.id) }}
      className="group block"
    >
      <div className="relative rounded-xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)] hover:-translate-y-[1px] md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors md:text-xl">
                {heading}
              </h3>
              {entry.partOfSpeech && (
                <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground ring-1 ring-inset ring-border/40">
                  {entry.partOfSpeech}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground line-clamp-2">
              {subtext}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 pt-1">
            {entry.soundFilename && env.VITE_PUBLIC_BUCKET_NAME && (
              <span onClick={(e) => e.preventDefault()}>
                <SoundButton
                  filename={entry.soundFilename}
                  bucketName={env.VITE_PUBLIC_BUCKET_NAME}
                />
              </span>
            )}
            <ChevronRight className="size-4 text-muted-foreground/40 transition-all group-hover:text-muted-foreground group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
