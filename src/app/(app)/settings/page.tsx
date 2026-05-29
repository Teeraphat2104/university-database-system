import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getCachedSettings } from "@/lib/settings"
import { SettingsClient } from "./settings-client"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if ((session.user as any).role !== "admin") redirect("/dashboard")

  const settings = await getCachedSettings()

  return <SettingsClient settings={settings} />
}
