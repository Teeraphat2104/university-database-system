import { cache } from "react"
import { prisma } from "./prisma"
import { SETTINGS_DEFAULTS } from "./defaults"

export const getCachedSettings = cache(async () => {
  const all = await prisma.setting.findMany()
  const db = Object.fromEntries(all.map((s) => [s.key, s.value]))
  return { ...SETTINGS_DEFAULTS, ...db } as Record<string, string>
})
