import { createFileRoute, Link } from '@tanstack/react-router'
import { searchEntries } from '@/server/entries'
import { PageContainer } from '@/components/page-container'
import { EntryCard } from '@/components/entry-card'
import { ArrowLeft, SearchX } from 'lucide-react'
import { t } from '@/lib/i18n'

export const Route = createFileRoute('/s/$term')({
  component: SearchResults,
  loader: async ({ params }) => {
    const term = decodeURIComponent(params.term)
    const results = await searchEntries({ data: { q: term, limit: 50 } })
    return { results, term }
  },
})

function SearchResults() {
  const { results, term } = Route.useLoaderData()
  // TODO: detect language from query or user preference
  const language = 'french' as const

  return (
    <PageContainer className="items-start">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 w-full">
        <Link to="/" className="hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <span>{t('search', language)}</span>
        <span className="text-border">/</span>
        <span className="text-foreground font-medium truncate">{term}</span>
      </div>

      <div className="flex items-baseline gap-3 mb-6 w-full">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('results', language)}
        </h1>
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {results.length}
        </span>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center w-full">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-4">
            <SearchX className="size-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">{t('no_results', language)}</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {t('no_results_desc', language)}
          </p>
          <Link
            to="/$dir/index/$letter"
            params={{ dir: 'mb-fr', letter: 'a' }}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('view_index', language)}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full animate-stagger">
          {results.map((entry) => (
            <EntryCard key={entry.id} entry={entry} direction="mb-fr" />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
