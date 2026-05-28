import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { LandingSearch } from "./landing-search"

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
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold">University DB</span>
          <Link
            href="/login"
            className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-16 space-y-16">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            University Database System
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse and search the university&apos;s archive of PDF documents,
            organized by category, year, and month.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Browse Documents</h2>
          <LandingSearch
            categories={categories}
            years={years}
            months={months}
          />

          {recentPdfs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentPdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="border rounded-lg p-4 space-y-1"
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
          )}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        University Database System
      </footer>
    </div>
  )
}
