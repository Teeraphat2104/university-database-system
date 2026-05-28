import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ThemeToggle } from "@/components/theme-toggle"
import { BrowsePdfGrid } from "@/components/browse/browse-pdf-grid"
import { IconArrowLeft, IconFolder } from "@tabler/icons-react"

export default async function BrowseCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) notFound()

  const pdfs = await prisma.pdf.findMany({
    where: { categoryId: id },
    include: { category: { select: { name: true, imagePath: true } } },
    orderBy: { createdAt: "desc" },
  })

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
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Browse Categories", href: "/browse/categories" },
              { label: category.name },
            ]}
          />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {category.imagePath ? (
                <img
                  src={`/api/categories/${category.id}/image`}
                  alt={category.name}
                  className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-muted border border-border shrink-0">
                  <IconFolder className="h-6 w-6 text-muted-foreground/40" />
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{category.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {pdfs.length} {pdfs.length === 1 ? "document" : "documents"}
                </p>
              </div>
            </div>
            <Link
              href="/browse/categories"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              <IconArrowLeft className="h-4 w-4" />
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-10">
        <BrowsePdfGrid pdfs={pdfs} />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        University Database System
      </footer>
    </div>
  )
}
