import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { put } from "@vercel/blob"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File
  const title = formData.get("title") as string
  const categoryId = formData.get("categoryId") as string
  const year = parseInt(formData.get("year") as string)
  const month = parseInt(formData.get("month") as string)
  const description = (formData.get("description") as string) || null

  if (!file || !title || !categoryId || !year || !month) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const ext = path.extname(file.name)
  const filename = `${crypto.randomUUID()}${ext}`

  let filePath: string
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: "public" })
    filePath = blob.url
  } else {
    const uploadDir = path.join(process.cwd(), "uploads")
    filePath = path.join(uploadDir, filename)
    await mkdir(uploadDir, { recursive: true })
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))
  }

  const pdf = await prisma.pdf.create({
    data: {
      title,
      description,
      year,
      month,
      filePath,
      originalName: file.name,
      fileSize: file.size,
      uploadedById: session.user.id,
      categoryId,
    },
  })

  return Response.json({ success: true, id: pdf.id })
}
