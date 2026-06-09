"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { del } from "@vercel/blob"
import { unlink } from "fs/promises"
import path from "path"

export async function updatePdfAction(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const categoryId = formData.get("categoryId") as string
  const year = parseInt(formData.get("year") as string)
  const month = parseInt(formData.get("month") as string)
  const description = (formData.get("description") as string) || null

  if (!id || !title || !categoryId || !year || !month) {
    return { error: "Missing required fields" }
  }

  await prisma.pdf.update({
    where: { id },
    data: { title, description, year, month, categoryId },
  })

  revalidatePath("/pdfs")
  return { error: null }
}

export async function deletePdfAction(id: string) {
  const pdf = await prisma.pdf.findUnique({ where: { id } })
  if (!pdf) return { error: "Not found" }

  if (pdf.filePath.startsWith("https://") && pdf.filePath.includes("blob.vercel-storage.com")) {
    await del(pdf.filePath)
  } else {
    const filePath = path.join(process.cwd(), "uploads", pdf.filePath)
    await unlink(filePath).catch(() => {})
  }
  await prisma.pdf.delete({ where: { id } })

  revalidatePath("/pdfs")
  return { error: null }
}
