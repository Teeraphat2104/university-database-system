"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function createAdminAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as "admin" | "editor"

  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Email already in use" }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { name, email, hashedPassword, role: role || "editor" },
  })

  revalidatePath("/admins")
  return { error: null }
}

export async function deleteAdminAction(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath("/admins")
  return { error: null }
}
