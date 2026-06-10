import { prisma } from "@/lib/prisma"
import { UploadZone } from "./upload-zone"

export default async function UploadPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  const pdfCount = await prisma.pdf.count()

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Upload PDF</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pdfCount} document{pdfCount === 1 ? "" : "s"} in archive
        </p>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <UploadZone categories={categories} />
      </div>
    </div>
  )
}
