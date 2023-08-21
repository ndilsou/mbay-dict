import { SearchBar } from "@/components/search-bar";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

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
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased overflow-hidden", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <header className="sticky top-0 z-40 w-full border-b bg-background h-header flex justify-between px-10 items-center"> */}
          <header className="w-full border-b bg-background h-header flex justify-between px-10 items-center">
            <Title lang="fr" />
            <div>
              <SearchBar />
            </div>
            <ThemeToggle />
          </header>
          {/* <div className="mt-header" /> */}
          <main className="overflow-auto min-h-page h-page scroll-auto bg-muted">
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
