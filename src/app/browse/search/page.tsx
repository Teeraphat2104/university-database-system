import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BrowsePdfGrid } from "@/components/browse/browse-pdf-grid"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconArrowLeft, IconSearch } from "@tabler/icons-react"
import { MONTHS } from "@/lib/constants"
import { SearchForm } from "./search-form"

export default async function BrowseSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; year?: string; month?: string }>
}) {
  const params = await searchParams

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  const where: any = {}
  if (params.category) where.categoryId = params.category
  if (params.year) where.year = parseInt(params.year)
  if (params.month) where.month = parseInt(params.month)
  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { description: { contains: params.q } },
    ]
  }

  const pdfs = await prisma.pdf.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true, imagePath: true } } },
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold">University DB</Link>
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

      <section className="bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12 space-y-4">
          <div className="flex items-center justify-between">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Search" }]}
            />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <IconArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {params.q || params.category || params.year || params.month
                ? "Search Results"
                : "Search Documents"}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {pdfs.length > 0
                ? `Found ${pdfs.length} ${pdfs.length === 1 ? "document" : "documents"}`
                : "Browse the university's document archive"}
            </p>
          </div>

          <SearchForm
            key={JSON.stringify(params)}
            categories={categories}
            years={years}
            months={[...MONTHS]}
            initialQ={params.q || ""}
            initialCategory={params.category || ""}
            initialYear={params.year || ""}
            initialMonth={params.month || ""}
          />
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-10">
        {pdfs.length > 0 ? (
          <BrowsePdfGrid key={JSON.stringify(params)} pdfs={pdfs} />
        ) : (
          <div className="text-center py-16 space-y-3">
            <IconSearch className="h-10 w-10 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">No documents found</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        University Database System
      </footer>
    </div>
  )
}
