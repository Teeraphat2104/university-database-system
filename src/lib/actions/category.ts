"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { put, del } from "@vercel/blob"
import { writeFile, unlink, mkdir } from "fs/promises"
import path from "path"

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"]
const MAX_SIZE = 5 * 1024 * 1024

function isBlobUrl(url: string) {
  return url.startsWith("https://") && url.includes("blob.vercel-storage.com")
}

async function saveImage(file: File): Promise<string | null> {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Invalid image type")
  if (file.size > MAX_SIZE) throw new Error("Image too large")

  const ext = path.extname(file.name)
  const filename = `${crypto.randomUUID()}${ext}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`category-images/${filename}`, file, { access: "public" })
    return blob.url
  }

  const uploadDir = path.join(process.cwd(), "uploads", "category-images")
  const filePath = path.join(uploadDir, filename)
  await mkdir(uploadDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))
  return filename
}

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string
  if (!name) return { error: "Name is required" }

  const slug = name.toLowerCase().replace(/\s+/g, "-")

  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) return { error: "Category already exists" }

  let imagePath: string | null = null
  const image = formData.get("image") as File | null
  if (image && image.size > 0) {
    try {
      imagePath = await saveImage(image)
    } catch (e: any) {
      return { error: e.message }
    }
  }

  await prisma.category.create({ data: { name, slug, imagePath } })
  revalidatePath("/categories")
  return { error: null }
}

async function deleteStoredFile(imagePath: string) {
  if (isBlobUrl(imagePath)) {
    await del(imagePath)
  } else {
    const filePath = path.join(process.cwd(), "uploads", "category-images", imagePath)
    await unlink(filePath).catch(() => {})
  }
}

export async function deleteCategoryAction(id: string) {
  const pdfCount = await prisma.pdf.count({ where: { categoryId: id } })
  if (pdfCount > 0) {
    return { error: `Cannot delete: ${pdfCount} PDF(s) use this category` }
  }

  const category = await prisma.category.findUnique({ where: { id } })
  if (category?.imagePath) {
    await deleteStoredFile(category.imagePath)
  }

  await prisma.category.delete({ where: { id } })
  revalidatePath("/categories")
  return { error: null }
}

export async function updateCategoryAction(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  if (!id || !name) return { error: "All fields are required" }

  const slug = name.toLowerCase().replace(/\s+/g, "-")

  const existing = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  })
  if (existing) return { error: "Category name already taken" }

  const category = await prisma.category.findUnique({ where: { id } })
  let imagePath = category?.imagePath ?? null

  const image = formData.get("image") as File | null
  if (image && image.size > 0) {
    try {
      imagePath = await saveImage(image)
      if (category?.imagePath) {
        await deleteStoredFile(category.imagePath)
      }
    } catch (e: any) {
      return { error: e.message }
    }
  }

  const removeImage = formData.get("removeImage") === "true"
  if (removeImage && category?.imagePath) {
    await deleteStoredFile(category.imagePath)
    imagePath = null
  }

  await prisma.category.update({ where: { id }, data: { name, slug, imagePath } })
  revalidatePath("/categories")
  return { error: null }
}
