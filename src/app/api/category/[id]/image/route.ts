import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import path from "path"

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id },
    select: { imagePath: true },
  })

  if (!category?.imagePath) {
    return Response.json({ image: null })
  }

  const ext = path.extname(category.imagePath).toLowerCase()
  const contentType = MIME[ext] ?? "application/octet-stream"
  const filePath = path.join(process.cwd(), "uploads", "category-images", category.imagePath)

  try {
    const buffer = await readFile(filePath)
    const base64 = buffer.toString("base64")
    return Response.json({ image: `data:${contentType};base64,${base64}` })
  } catch {
    return Response.json({ image: null })
  }
}
