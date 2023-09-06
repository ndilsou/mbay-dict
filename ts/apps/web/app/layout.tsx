import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { SearchBar } from "@/components/search-bar";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    // icon: "/favicon.png",
    icon: "/egg.ico",
  },
};

function Header() {
  return (
    <header className="w-full border-b bg-background h-header flex justify-between px-2 md:px-10 items-center md:flex-row">
      <div className="hidden md:block">
        <Title lang="fr" />
      </div>
      <div className="w-full flex justify-center md:w-fit">
        <SearchBar className="w-full max-w-sm md:max-w-lg md:w-96" />
      </div>
      <div className="hidden md:block">
        <ThemeToggle />
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased overflow-hidden", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main
            id="page-main"
            className="overflow-auto min-h-page h-page scroll-auto"
          >
            {children}
          </main>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}

function Title({ lang }: { lang: "fr" | "en" }) {
  let title: string;
  if (lang === "fr") {
    title = "Dictionnaire Mbay-Français";
  } else if (lang === "en") {
    title = "Mbay-French Dictionary";
  } else {
    throw new Error(`Unknown language: ${lang}`);
  }

  return (
    <Link href="/">
      <h1 className="text-lg font-bold text-center">{title}</h1>
    </Link>
  );
}
