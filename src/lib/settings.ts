import { cache } from "react"
import { prisma } from "./prisma"
import { SETTINGS_DEFAULTS } from "./defaults"

export const getCachedSettings = cache(async () => {
  try {
    const all = await prisma.setting.findMany()
    const db = Object.fromEntries(all.map((s) => [s.key, s.value]))
    return { ...SETTINGS_DEFAULTS, ...db } as Record<string, string>
  } catch {
    console.error("Failed to fetch settings, using defaults")
    return { ...SETTINGS_DEFAULTS } as Record<string, string>
  }
})
