import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { LandingSearch } from "./landing-search"
import { ThemeToggle } from "@/components/theme-toggle"

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
      <header className="border-b border-white/10 bg-[#1e293b]">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-white">University DB</span>
          <div className="flex items-center gap-2">
            <div className="[&_button]:text-white/70 [&_button]:hover:text-white [&_button]:transition-colors">
              <ThemeToggle />
            </div>
            <Link
              href="/login"
              className="rounded-lg border border-white/30 text-white px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#1e293b]">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center space-y-5">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            University Database System
          </h1>
          <p className="text-blue-200 max-w-lg mx-auto">
            Browse and search the university&apos;s archive of PDF documents,
            organized by category, year, and month.
          </p>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 -mt-8 pb-16 space-y-12">
        <section className="bg-background border rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">Browse Documents</h2>
          <LandingSearch
            categories={categories}
            years={years}
            months={months}
          />
        </section>

        {recentPdfs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentPdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="border rounded-lg p-4 space-y-1 border-l-[3px] border-l-primary hover:shadow-sm transition-shadow"
                >
                  <p className="text-sm font-medium">{pdf.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {pdf.category.name} &middot; {months[pdf.month - 1]} {pdf.year}
                  </p>
                  {pdf.description && (
                    <p className="text-xs text-muted-foreground">{pdf.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        University Database System
      </footer>
    </div>
  )
}
