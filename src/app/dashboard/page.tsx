import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const [pdfCount, categoryCount, adminCount, editorCount] = await Promise.all([
    prisma.pdf.count(),
    prisma.category.count(),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.user.count({ where: { role: "editor" } }),
  ])

  const recentPdfs = await prisma.pdf.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true, uploadedBy: { select: { name: true } } },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="PDFs" value={pdfCount} />
        <StatCard label="Categories" value={categoryCount} />
        <StatCard label="Admins" value={adminCount} />
        <StatCard label="Editors" value={editorCount} />
      </div>

      {recentPdfs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Recent PDFs</h2>
          <div className="border rounded-lg divide-y">
            {recentPdfs.map((pdf) => (
              <div key={pdf.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{pdf.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {pdf.category.name} &middot; {pdf.year}/{pdf.month}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{pdf.uploadedBy.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}
