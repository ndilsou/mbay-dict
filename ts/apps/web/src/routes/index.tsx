import { createFileRoute, Link } from '@tanstack/react-router'
import { listLetters } from '@/server/entries'
import type { Direction } from '@/lib/constants'
import { Alphabet } from '@/components/alphabet'
import { ArrowRight } from 'lucide-react'
import { Icon } from '@iconify/react'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const letters = await listLetters({ data: { column: 'head_letter' } })
    return { letters }
  },
})

function Home() {
  const { letters } = Route.useLoaderData()

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-emerald/[0.03]" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Icon icon="solar:book-bookmark-bold-duotone" className="size-3.5" />
            Dictionnaire trilingue
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Dictionnaire{' '}
            <span className="text-primary">Mbay</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto md:text-xl">
            Explorez la richesse de la langue Mbay du Tchad avec des
            traductions en francais et en anglais.
          </p>

          {/* Language CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/$dir/index/$letter"
              params={{ dir: 'mb-fr' as Direction, letter: 'a' }}
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:shadow-md hover:shadow-primary/30 hover:-translate-y-[1px] active:translate-y-0"
            >
              Francais / Mbay
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/$dir/index/$letter"
              params={{ dir: 'mb-en' as Direction, letter: 'a' }}
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:shadow-md hover:border-border/80 hover:-translate-y-[1px] active:translate-y-0"
            >
              English / Mbay
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Alphabet */}
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <div className="text-center mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Explorer par lettre
          </h2>
        </div>
        <Alphabet dir="mb-fr" letters={letters} />
      </section>

      {/* Info cards */}
      <section className="mx-auto max-w-4xl px-4 pb-16 md:px-6 md:pb-24">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Memorial card */}
          <div className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-border hover:shadow-sm md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center size-10 rounded-xl bg-rose-500/10 text-rose-500">
                <Icon icon="solar:heart-bold-duotone" className="size-5" />
              </div>
              <h3 className="font-semibold">
                <a
                  href="https://morkegbooks.com/Services/World/Languages/SaraBagirmi/#title"
                  className="hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  A la memoire de John Keegan
                </a>
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              La traduction francaise disponible sur ce site n&apos;aurait pas
              ete possible sans les travaux de recherche linguistique sur les
              langues Sara-Bagirmi du Sud du Tchad de John Keegan.
            </p>
            <a
              href="https://morkegbooks.com/Services/World/Languages/SaraBagirmi/SoundDictionary/Mbay/"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir le dictionnaire original
              <ArrowRight className="size-3" />
            </a>
          </div>

          {/* Association card */}
          <div className="rounded-2xl border border-emerald/20 bg-emerald-muted/30 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center size-10 rounded-xl bg-emerald/10 text-emerald">
                <Icon icon="solar:leaf-bold-duotone" className="size-5" />
              </div>
              <h3 className="font-semibold text-sm">
                ASDCM
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ce site est mis a la disposition de la communaute et diaspora
              Mbay au Tchad et dans le monde dans l&apos;espoir de preserver
              notre langue et notre culture.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
