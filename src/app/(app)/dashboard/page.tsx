import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  IconFileDescription, IconFolder, IconUsers, IconUpload,
  IconArrowRight, IconCalendar,
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
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {session.user.name}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl p-4 sm:p-5 space-y-2 hover:shadow-sm transition-shadow bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-950/10">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
              <IconFileDescription className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs text-muted-foreground bg-background/80 rounded-full px-2 py-0.5 border">
              +{pdfsThisMonth} this month
            </span>
          </div>
          <p className="text-2xl font-bold">{pdfCount}</p>
          <p className="text-xs text-muted-foreground">Total PDFs</p>
        </div>
        <div className="border border-border rounded-xl p-4 sm:p-5 space-y-2 hover:shadow-sm transition-shadow bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/10">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <IconFolder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold">{categoryCount}</p>
          <p className="text-xs text-muted-foreground">Categories</p>
        </div>
        <div className="border border-border rounded-xl p-4 sm:p-5 space-y-2 hover:shadow-sm transition-shadow bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/10">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <IconUsers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-muted-foreground bg-background/80 rounded-full px-2 py-0.5 border">
              {adminCount} admin{adminCount === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-2xl font-bold">{userCount}</p>
          <p className="text-xs text-muted-foreground">Users</p>
        </div>
      </div>

      {/* Quick actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/pdfs/upload"
            className="border border-border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm hover:border-primary/30 transition-all group"
          >
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <IconUpload className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Upload PDF</p>
              <p className="text-xs text-muted-foreground">Add a new document</p>
            </div>
            <IconArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link
            href="/pdfs"
            className="border border-border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm hover:border-primary/30 transition-all group"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
              <IconFileDescription className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Browse PDFs</p>
              <p className="text-xs text-muted-foreground">Search and filter documents</p>
            </div>
            <IconArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link
            href="/categories"
            className="border border-border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm hover:border-primary/30 transition-all group"
          >
            <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900 transition-colors">
              <IconFolder className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Categories</p>
              <p className="text-xs text-muted-foreground">Manage document categories</p>
            </div>
            <IconArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </section>

      {/* Recent PDFs */}
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
          <div className="text-center py-12 space-y-3 border border-dashed border-border rounded-xl">
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
