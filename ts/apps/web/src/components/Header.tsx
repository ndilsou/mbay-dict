import { Link } from '@tanstack/react-router'
import { SearchBar } from './search-bar'
import { ThemeToggle } from './theme-toggle'
import { Icon } from '@iconify/react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:h-16 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Icon icon="solar:book-bookmark-bold-duotone" className="size-[18px]" />
          </div>
          <span className="hidden sm:block text-sm font-semibold tracking-tight">
            Dictionnaire Mbay
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-auto md:max-w-lg">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
