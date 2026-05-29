"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateSettingsAction(formData: FormData) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") {
    return { error: "Unauthorized" }
  }

  for (const [key, value] of formData.entries()) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: value as string },
      create: { key, value: value as string },
    })
  }

  revalidatePath("/settings")
  return { error: null }
}
