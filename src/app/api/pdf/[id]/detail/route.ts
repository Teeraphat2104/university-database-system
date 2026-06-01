import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const pdf = await prisma.pdf.findUnique({
    where: { id },
    include: {
      category: true,
      uploadedBy: { select: { name: true } },
    },
  })

  if (!pdf) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const session = await auth()
  const role = (session?.user as any)?.role
  const canEdit = role === "admin" || role === "editor"
  const canDelete = role === "admin"

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  return Response.json({
    pdf,
    canEdit: !!session?.user && canEdit,
    canDelete: !!session?.user && canDelete,
    categories,
  })
}
