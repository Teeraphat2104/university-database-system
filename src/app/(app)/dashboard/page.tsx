import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  IconFileDescription, IconFolder, IconUsers, IconUpload, IconArrowRight,
} from "@tabler/icons-react"
import { DashboardRecent } from "./dashboard-recent"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const pdfCount = await prisma.pdf.count()
  const categoryCount = await prisma.category.count()
  const userCount = await prisma.user.count()
  const adminCount = await prisma.user.count({ where: { role: "admin" } })

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const pdfsThisMonth = await prisma.pdf.count({
    where: { createdAt: { gte: firstOfMonth } },
  })

  const recentPdfs = await prisma.pdf.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {session.user.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total PDFs</p>
            <IconFileDescription className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tabular-nums tracking-tight">
              {pdfCount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground/70">
              +{pdfsThisMonth} this month
            </p>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Categories</p>
            <IconFolder className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-bold tabular-nums tracking-tight">
            {categoryCount}
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Users</p>
            <IconUsers className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tabular-nums tracking-tight">
              {userCount}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {adminCount} admin{adminCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/pdfs/upload"
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:border-primary hover:bg-accent transition-all group"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <IconUpload className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Upload PDF</span>
              <span className="text-xs text-muted-foreground">Add new document</span>
            </div>
          </Link>
          <Link
            href="/pdfs"
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:border-primary hover:bg-accent transition-all group"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <IconFileDescription className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Browse PDFs</span>
              <span className="text-xs text-muted-foreground">View all documents</span>
            </div>
          </Link>
          <Link
            href="/categories"
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:border-primary hover:bg-accent transition-all group"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <IconFolder className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Categories</span>
              <span className="text-xs text-muted-foreground">Manage organization</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent PDFs</h2>
          <Link
            href="/pdfs"
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            View all <IconArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentPdfs.length === 0 ? (
          <div className="text-center py-12 space-y-3 border border-dashed border-border">
            <IconFileDescription className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">No PDFs yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Upload your first document to get started.</p>
            </div>
            <Link
              href="/pdfs/upload"
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Upload a PDF
            </Link>
          </div>
        ) : (
          <DashboardRecent pdfs={recentPdfs} />
        )}
      </section>
    </div>
  )
}
