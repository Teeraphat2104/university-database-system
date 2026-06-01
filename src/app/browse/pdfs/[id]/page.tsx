import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ThemeToggle } from "@/components/theme-toggle"
import { MONTHS } from "@/lib/constants"
import { IconArrowLeft, IconCalendar, IconFolder, IconUser, IconWeight, IconDownload } from "@tabler/icons-react"

export default async function BrowsePdfDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const pdf = await prisma.pdf.findUnique({
    where: { id },
    include: {
      category: true,
      uploadedBy: { select: { name: true } },
    },
  })

  if (!pdf) notFound()

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

      <div className="mx-auto max-w-6xl w-full px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Browse Categories", href: "/browse/categories" },
              { label: pdf.title },
            ]}
          />
          <Link
            href="/browse/categories"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            <IconArrowLeft className="h-4 w-4" />
            Browse Categories
          </Link>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="space-y-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{pdf.title}</h1>
            <p className="text-sm text-muted-foreground">{pdf.originalName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <iframe
              src={`/api/pdfs/${pdf.id}/download`}
              className="w-full border border-border rounded-xl min-h-[50vh] lg:min-h-[80vh]"
              title={pdf.title}
            />
          </div>

          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5 space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <IconFolder className="h-3 w-3" /> Category
                </p>
                <div className="flex items-center gap-2">
                  {pdf.category.imagePath && (
                    <img src={`/api/categories/${pdf.categoryId}/image`} alt="" className="w-5 h-5 rounded object-cover border border-border" />
                  )}
                  <p className="text-sm font-medium">{pdf.category.name}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <IconCalendar className="h-3 w-3" /> Date
                </p>
                <p className="text-sm font-medium">{MONTHS[pdf.month - 1]} {pdf.year}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <IconWeight className="h-3 w-3" /> Size
                </p>
                <p className="text-sm font-medium">
                  {pdf.fileSize ? `${(pdf.fileSize / 1024).toFixed(0)} KB` : "—"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <IconUser className="h-3 w-3" /> Uploaded by
                </p>
                <p className="text-sm font-medium">{pdf.uploadedBy.name}</p>
              </div>

              {pdf.description && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium">Description</p>
                  <p className="text-sm">{pdf.description}</p>
                </div>
              )}
            </div>

            <a
              href={`/api/pdfs/${pdf.id}/download`}
              download
              className="flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:brightness-110 transition-all"
            >
              <IconDownload className="h-4 w-4" />
              Download PDF
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        University Database System
      </footer>
    </div>
  )
}
