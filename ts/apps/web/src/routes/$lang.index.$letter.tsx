import { createFileRoute, Link } from '@tanstack/react-router'
import { listByLetter, listLetters } from '@/server/entries'
import { EntryCard } from '@/components/entry-card'
import { Alphabet, AlphabetCollapsible } from '@/components/alphabet'
import { LetterScroll } from '@/components/letter-scroll'
import { langCodeToName, type LangName } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/$lang/index/$letter')({
  component: IndexAtLetter,
  loader: async ({ params }) => {
    const [entries, letters] = await Promise.all([
      listByLetter({ data: { letter: params.letter } }),
      listLetters(),
    ])
    return { entries, letters, lang: params.lang, letter: params.letter }
  },
})

function IndexAtLetter() {
  const { entries, letters, lang, letter } = Route.useLoaderData()
  let language: LangName
  try {
    language = langCodeToName(lang)
  } catch {
    language = 'french'
  }

  return (
    <div className="relative mx-auto max-w-4xl w-full animate-fade-in">
      <span id="page-top" />

      {/* Mobile alphabet */}
      <div className="px-4 pt-6 lg:hidden">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 w-full">
          <Link to="/" className="hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <span>Index</span>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium capitalize">
            {letter}
          </span>
        </div>
        <AlphabetCollapsible
          language={language}
          letters={letters}
          activeLetter={letter}
        />
      </div>

      {/* Desktop: two-column layout with sticky sidebar */}
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 py-6 md:px-6 md:py-10">
          {/* Desktop breadcrumb + alphabet */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 w-full">
              <Link
                to="/"
                className="hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <span>Index</span>
              <span className="text-border">/</span>
              <span className="text-foreground font-medium capitalize">
                {letter}
              </span>
            </div>
            <Alphabet
              language={language}
              letters={letters}
              activeLetter={letter}
              className="mb-8"
            />
          </div>

          {/* Entries */}
          <div className="flex items-baseline gap-3 mb-5">
            <h1 className="text-4xl font-bold capitalize tracking-tight md:text-5xl">
              {letter}
            </h1>
            <span className="text-sm text-muted-foreground">
              {entries.length}{' '}
              {entries.length === 1
                ? t('entry', language)
                : t('entries', language)}
            </span>
          </div>
          <div className="flex flex-col gap-2 animate-stagger">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} language={language} />
            ))}
          </div>

          <span id="page-bottom" className="block mt-16" />
        </div>

        {/* Desktop sticky sidebar */}
        <div className="hidden lg:block shrink-0 w-12 py-10">
          <div className="sticky top-20">
            <LetterScroll language={language} activeLetter={letter} />
          </div>
        </div>
      </div>
    </div>
  )
}
