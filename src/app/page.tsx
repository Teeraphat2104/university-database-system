import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { LandingSearch } from "./landing-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { RecentPdfs } from "@/components/recent-pdfs"

export default async function HomePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  const recentPdfs = await prisma.pdf.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">University DB</span>
          <div className="flex items-center gap-2">
            <div className="[&_button]:flex [&_button]:items-center [&_button]:gap-1.5 [&_button]:text-xs [&_button]:text-muted-foreground [&_button]:hover:text-primary [&_button]:transition-colors">
              <ThemeToggle />
            </div>
            <Link
              href="/login"
              className="rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium hover:brightness-110 transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-muted/50 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            University Database System
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse and search the university&apos;s archive of PDF documents,
            organized by category, year, and month.
          </p>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 -mt-6 pb-16 space-y-10">
        <section className="bg-background border border-border rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold">Browse Documents</h2>
          <LandingSearch
            categories={categories}
            years={years}
            months={months}
          />
        </section>

        {recentPdfs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold">Recent Documents</h2>
            <RecentPdfs pdfs={recentPdfs} />
          </section>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        University Database System
      </footer>
    </div>
  )
}
