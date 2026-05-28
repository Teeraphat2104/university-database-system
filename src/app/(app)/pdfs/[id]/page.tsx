import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { PdfDetail } from "./pdf-detail"

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export default async function PdfDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { id } = await params

  const pdf = await prisma.pdf.findUnique({
    where: { id },
    include: {
      category: true,
      uploadedBy: { select: { name: true } },
    },
  })

  if (!pdf) notFound()

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  const role = (session.user as any).role
  const canEdit = role === "admin" || role === "editor"
  const canDelete = role === "admin"

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  return (
    <PdfDetail
      pdf={pdf}
      categories={categories}
      months={months}
      years={years}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  )
}
