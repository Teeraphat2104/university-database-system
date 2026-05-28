import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { readFile } from "fs/promises"
import path from "path"

export async function GET(
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
  const buffer = await readFile(filePath)

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdf.originalName}"`,
      "Content-Length": buffer.length.toString(),
    },
  })
}
