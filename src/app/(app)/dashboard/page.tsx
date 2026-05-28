import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { IconFileDescription, IconFolder, IconUsers, IconEye } from "@tabler/icons-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const pdfCount = await prisma.pdf.count()
  const categoryCount = await prisma.category.count()
  const adminCount = await prisma.user.count()
  const recentPdfs = await prisma.pdf.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {session.user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <IconFileDescription className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total PDFs</p>
            <p className="text-xl font-bold">{pdfCount}</p>
          </div>
        </div>
        <div className="border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <IconFolder className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Categories</p>
            <p className="text-xl font-bold">{categoryCount}</p>
          </div>
        </div>
        <div className="border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <IconUsers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Users</p>
            <p className="text-xl font-bold">{adminCount}</p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Recently Added PDFs</h2>
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
          <div className="border border-border rounded-lg divide-y divide-border">
            {recentPdfs.map((pdf) => (
              <Link
                key={pdf.id}
                href={`/pdfs/${pdf.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{pdf.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {pdf.category.name} &middot; {pdf.fileSize ? `${(pdf.fileSize / 1024).toFixed(0)} KB` : ""}
                  </p>
                </div>
                <IconEye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
