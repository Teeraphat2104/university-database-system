import { prisma } from "@/lib/prisma"
import { UploadZone } from "./upload-zone"

export default async function UploadPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Upload PDF</h1>
      <UploadZone categories={categories} years={years} months={months} />
    </div>
  )
}
