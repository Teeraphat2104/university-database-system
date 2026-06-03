import { LandingSearch } from "@/app/landing-search"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

function HeroTitle({ title, highlight }: { title: string; highlight: string }) {
  if (!highlight || !title.includes(highlight)) {
    return <>{title}</>
  }
  const parts = title.split(highlight)
  return (
    <>
      {parts[0]}
      <span className="text-primary">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  )
}

export function HeroSection({
  categories,
  years,
  months,
  settings,
}: {
  categories: { id: string; name: string; imagePath?: string | null }[]
  years: number[]
  months: string[]
  settings?: Record<string, string>
}) {
  const heroTitle = settings?.heroTitle ?? "University Database System"
  const heroHighlight = settings?.heroTitleHighlight ?? "Database"
  const heroSubtitle = settings?.heroSubtitle ?? "Browse and search the university\u2019s archive of PDF documents, organized by category, year, and month."
  const siteName = settings?.siteName ?? "University DB"

  return (
    <section className="flex flex-col border-b border-border">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">{siteName}</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium hover:brightness-110 transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-4xl w-full mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
              <HeroTitle title={heroTitle} highlight={heroHighlight} />
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <LandingSearch
              categories={categories}
              years={years}
              months={months}
              hero
            />
          </div>
        </div>
      </div>
    </section>
  )
}
