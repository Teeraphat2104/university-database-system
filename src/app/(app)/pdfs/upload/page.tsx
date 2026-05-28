import { prisma } from "@/lib/prisma"
import { UploadZone } from "./upload-zone"

export default async function UploadPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  const pdfCount = await prisma.pdf.count()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Upload PDF</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pdfCount} document{pdfCount === 1 ? "" : "s"} in archive
        </p>
      </div>
      <UploadZone categories={categories} />
    </div>
  )
}
