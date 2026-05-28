import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { unlink } from "fs/promises"
import path from "path"

export async function PATCH(
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const pdf = await prisma.pdf.findUnique({ where: { id } })
  if (!pdf) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const filePath = path.join(process.cwd(), "uploads", pdf.filePath)
  await unlink(filePath).catch(() => {})
  await prisma.pdf.delete({ where: { id } })

  return Response.json({ success: true })
}
