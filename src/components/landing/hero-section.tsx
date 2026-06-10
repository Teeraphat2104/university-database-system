import { LandingSearch } from "@/app/landing-search"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function HeroSection({
  pdfCount,
  settings,
}: {
  pdfCount: number
  categories?: { id: string; name: string; imagePath?: string | null }[]
  years?: number[]
  months?: string[]
  settings?: Record<string, string>
}) {
  const heroTitle = settings?.heroTitle ?? "University Database System"
  const heroSubtitle = settings?.heroSubtitle ?? "Browse and search the university\u2019s archive of PDF documents, organized by category, year, and month."
  const siteName = settings?.siteName ?? "University DB"

  return (
    <section className="flex flex-col">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">{siteName}</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg border border-border text-foreground px-4 py-1.5 text-sm font-medium hover:bg-muted transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-20">
        <div className="max-w-4xl w-full mx-auto text-center space-y-10">
          <div className="space-y-6">
            <p className="text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tight text-foreground tabular-nums leading-none">
              {pdfCount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              documents
            </p>
            <div className="space-y-2 pt-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                {heroTitle}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                {heroSubtitle}
              </p>
            </div>
          </div>

          <div>
            <LandingSearch hero />
          </div>
        </div>
      </div>
    </section>
  )
}
