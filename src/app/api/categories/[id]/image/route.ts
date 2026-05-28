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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id },
    select: { imagePath: true },
  })

  if (!category?.imagePath) {
    return new Response("Not found", { status: 404 })
  }

  const ext = path.extname(category.imagePath).toLowerCase()
  const contentType = MIME[ext] ?? "application/octet-stream"
  const filePath = path.join(process.cwd(), "uploads", "category-images", category.imagePath)

  try {
    const buffer = await readFile(filePath)
    return new Response(buffer, {
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
