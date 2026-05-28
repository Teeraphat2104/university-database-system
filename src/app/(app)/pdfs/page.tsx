import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PdfList } from "./pdf-list"

export default async function PdfsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; year?: string; month?: string; q?: string }>
}) {
  const session = await auth()
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

  const role = (session?.user as any)?.role
  const canEdit = role === "admin" || role === "editor"
  const canDelete = role === "admin"
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">PDFs</h1>
      <PdfList
        pdfs={pdfs}
        categories={categories}
        years={years}
        months={months}
        canEdit={canEdit}
        canDelete={canDelete}
        initialQ={params.q || ""}
        initialCategory={params.category || ""}
        initialYear={params.year || ""}
        initialMonth={params.month || ""}
      />
    </div>
  )
}
