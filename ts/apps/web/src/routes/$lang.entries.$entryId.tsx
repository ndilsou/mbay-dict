import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getEntry } from '@/server/entries'
import { PageContainer } from '@/components/page-container'
import { SoundButton } from '@/components/sound-button'
import { langCodeToName, type LangName } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { Icon } from '@iconify/react'
import { env } from '@/env'
import { t } from '@/lib/i18n'

export const Route = createFileRoute('/$lang/entries/$entryId')({
  component: EntryDetail,
  loader: async ({ params }) => {
    const entry = await getEntry({
      data: { id: Number(params.entryId) },
    })
    return { entry, lang: params.lang }
  },
})

function EntryDetail() {
  const { entry, lang } = Route.useLoaderData()
  const router = useRouter()

  let language: LangName
  try {
    language = langCodeToName(lang)
  } catch {
    language = 'french'
  }

  if (!entry) {
    return (
      <PageContainer className="items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('entry_not_found', language)}</h1>
          <p className="text-muted-foreground mb-4">
            {t('entry_not_found_desc', language)}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t('back_home', language)}
          </Link>
        </div>
      </PageContainer>
    )
  }

  const translation = language === 'french' ? entry.french : entry.english
  const gramNote =
    language === 'french'
      ? entry.grammaticalNoteFr
      : entry.grammaticalNoteEn

  return (
    <PageContainer className="items-start max-w-3xl">
      {/* Back nav */}
      <button
        type="button"
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        {t('back', language)}
      </button>

      {/* Headword hero */}
      <div className="w-full pb-6 border-b border-border/60 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {entry.headword}
              </h1>
              {entry.partOfSpeech && (
                <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-border/40">
                  {entry.partOfSpeech}
                </span>
              )}
            </div>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground md:text-xl">
              {translation}
            </p>
          </div>
          {entry.soundFilename && env.VITE_PUBLIC_BUCKET_NAME && (
            <div className="shrink-0 pt-2">
              <SoundButton
                filename={entry.soundFilename}
                bucketName={env.VITE_PUBLIC_BUCKET_NAME}
              />
            </div>
          )}
        </div>

        {/* Grammatical note */}
        {gramNote && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-secondary/50 px-4 py-3">
            <Icon icon="solar:notebook-bold-duotone" className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {t('grammatical_note', language)}
              </span>
              <span className="mx-1.5 text-border">|</span>
              {gramNote}
            </div>
          </div>
        )}

        {/* Related word */}
        {entry.relatedWord && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Icon icon="solar:link-round-bold-duotone" className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {t('see_also', language)}:
            </span>
            {entry.relatedWord.relatedEntryId ? (
              <Link
                to="/$lang/entries/$entryId"
                params={{
                  lang,
                  entryId: String(entry.relatedWord.relatedEntryId),
                }}
                className="font-semibold text-primary hover:underline"
              >
                {entry.relatedWord.text}
              </Link>
            ) : (
              <span className="font-medium">{entry.relatedWord.text}</span>
            )}
          </div>
        )}
      </div>

      {/* Expressions */}
      {entry.expressions.length > 0 && (
        <section className="w-full mb-8 animate-slide-in-up">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="solar:chat-round-dots-bold-duotone" className="size-4 text-primary" />
            <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground">
              {t('expressions', language)}
            </h2>
            <span className="text-xs text-muted-foreground/60">
              ({entry.expressions.length})
            </span>
          </div>
          <div className="space-y-2">
            {entry.expressions.map((expr) => (
              <div
                key={expr.id}
                className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {expr.mbay}
                  </span>
                  {expr.soundFilename && env.VITE_PUBLIC_BUCKET_NAME && (
                    <SoundButton
                      filename={expr.soundFilename}
                      bucketName={env.VITE_PUBLIC_BUCKET_NAME}
                    />
                  )}
                </div>
                <p className="mt-1 text-[15px] text-muted-foreground">
                  {language === 'french' ? expr.french : expr.english}
                </p>
                {expr.exampleMbay && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-secondary/40 px-3 py-2.5 text-sm">
                    <Icon icon="solar:quote-down-circle-linear" className="size-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground/80">
                        {expr.exampleMbay}
                      </span>
                      <p className="text-muted-foreground mt-0.5">
                        {language === 'french'
                          ? expr.exampleFrench
                          : expr.exampleEnglish}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Examples */}
      {entry.examples.length > 0 && (
        <section className="w-full mb-8 animate-slide-in-up">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="solar:quote-down-circle-bold-duotone" className="size-4 text-primary" />
            <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground">
              {t('usage_examples', language)}
            </h2>
            <span className="text-xs text-muted-foreground/60">
              ({entry.examples.length})
            </span>
          </div>
          <div className="space-y-2">
            {entry.examples.map((ex) => (
              <div
                key={ex.id}
                className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {ex.mbay}
                  </span>
                  {ex.soundFilename && env.VITE_PUBLIC_BUCKET_NAME && (
                    <SoundButton
                      filename={ex.soundFilename}
                      bucketName={env.VITE_PUBLIC_BUCKET_NAME}
                    />
                  )}
                </div>
                <p className="mt-1 text-[15px] text-muted-foreground">
                  {language === 'french' ? ex.french : ex.english}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  )
}
