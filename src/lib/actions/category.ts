"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string
  if (!name) return { error: "Name is required" }

  const slug = name.toLowerCase().replace(/\s+/g, "-")

  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) return { error: "Category already exists" }

  await prisma.category.create({ data: { name, slug } })
  revalidatePath("/categories")
  return { error: null }
}

export async function deleteCategoryAction(id: string) {
  const pdfCount = await prisma.pdf.count({ where: { categoryId: id } })
  if (pdfCount > 0) {
    return { error: `Cannot delete: ${pdfCount} PDF(s) use this category` }
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

  await prisma.category.update({ where: { id }, data: { name, slug } })
  revalidatePath("/categories")
  return { error: null }
}
