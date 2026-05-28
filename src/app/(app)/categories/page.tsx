import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CategoriesClient } from "./categories-client"

export default async function CategoriesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if ((session.user as any).role !== "admin") redirect("/dashboard")

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { pdfs: true } } },
  })

  return (
    <CategoriesClient
      categories={categories.map((c) => ({ id: c.id, name: c.name, pdfCount: c._count.pdfs }))}
    />
  )
}
