import { prisma } from "@/lib/prisma"
import { UploadZone } from "./upload-zone"

export default async function UploadPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Upload PDF</h1>
      <UploadZone categories={categories} />
    </div>
  )
}
