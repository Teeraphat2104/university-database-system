import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import path from "path"

async function isBlobUrl(url: string) {
  return url.startsWith("https://") && url.includes("blob.vercel-storage.com")
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const pdf = await prisma.pdf.findUnique({ where: { id } })
  if (!pdf) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  if (await isBlobUrl(pdf.filePath)) {
    return Response.redirect(pdf.filePath)
  }

  const filePath = path.join(process.cwd(), "uploads", pdf.filePath)
  let buffer: Buffer
  try {
    buffer = await readFile(filePath)
  } catch {
    return Response.json({ error: "File not found on disk" }, { status: 404 })
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdf.originalName}"`,
      "Content-Length": buffer.length.toString(),
    },
  })
}
