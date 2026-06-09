import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { del } from "@vercel/blob"
import { unlink } from "fs/promises"
import path from "path"

export async function POST(
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

  if (pdf.filePath.startsWith("https://") && pdf.filePath.includes("blob.vercel-storage.com")) {
    await del(pdf.filePath)
  } else {
    const filePath = path.join(process.cwd(), "uploads", pdf.filePath)
    await unlink(filePath).catch(() => {})
  }
  await prisma.pdf.delete({ where: { id } })

  return Response.json({ success: true })
}
