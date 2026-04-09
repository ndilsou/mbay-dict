import { Search } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import { t } from '@/lib/i18n'
import type { LangName } from '@/lib/constants'

export function SearchBar({
  className,
  language = 'french',
}: {
  className?: string
  language?: LangName
}) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const q = new FormData(form).get('search') as string
    if (!q) return
    navigate({ to: '/s/$term', params: { term: q } })
    form.reset()
    inputRef.current?.blur()
  }

  return (
    <form
      className={cn('relative w-full', className)}
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          name="search"
          type="search"
          placeholder={t('search_placeholder', language)}
          className="w-full h-9 rounded-lg border border-input bg-secondary/50 pl-9 pr-16 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20 md:h-10"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </div>
    </form>
  )
}
