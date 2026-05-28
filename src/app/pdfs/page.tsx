import { prisma } from "@/lib/prisma"
import { PdfList } from "./pdf-list"

export default async function PdfsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; year?: string; month?: string; q?: string }>
}) {
  const params = await searchParams

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  const where: any = {}
  if (params.category) where.categoryId = params.category
  if (params.year) where.year = parseInt(params.year)
  if (params.month) where.month = parseInt(params.month)
  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { description: { contains: params.q } },
    ]
  }

  const pdfs = await prisma.pdf.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true, uploadedBy: { select: { name: true } } },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">PDFs</h1>
      <PdfList
        pdfs={pdfs}
        categories={categories}
        currentCategory={params.category || ""}
        currentYear={params.year || ""}
        currentMonth={params.month || ""}
        currentQ={params.q || ""}
      />
    </div>
  )
}
