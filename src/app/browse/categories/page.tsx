import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { CategoryShowcase } from "@/components/landing/category-showcase"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconArrowLeft } from "@tabler/icons-react"

export default async function BrowseCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

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

      <section className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12 space-y-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Browse Categories" }]} />
          <div className="flex justify-end">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <IconArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Browse Categories</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Explore the university&apos;s document archive, organized by category
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-10">
        <CategoryShowcase categories={categories} hideHeader />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        University Database System
      </footer>
    </div>
  )
}
