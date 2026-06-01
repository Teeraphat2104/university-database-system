import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { title, categoryId, year, month, description } = body

  if (!title || !categoryId || !year || !month) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  await prisma.pdf.update({
    where: { id },
    data: { title, description, year: parseInt(year), month: parseInt(month), categoryId },
  })

  return Response.json({ success: true })
}
