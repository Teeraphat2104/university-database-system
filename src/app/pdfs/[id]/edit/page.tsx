import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EditForm as EditPdfForm } from "./edit-form"

export default async function EditPdfPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pdf = await prisma.pdf.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!pdf) notFound()

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Edit PDF</h1>
      <EditPdfForm pdf={pdf} categories={categories} months={months} />
    </div>
  )
}
