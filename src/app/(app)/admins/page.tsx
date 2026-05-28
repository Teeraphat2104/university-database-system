import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminsClient } from "./admins-client"

export default async function AdminsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if ((session.user as any).role !== "admin") redirect("/dashboard")

  const admins = await prisma.user.findMany({ orderBy: { name: "asc" } })

  return (
    <AdminsClient
      admins={admins.map((a) => ({ id: a.id, name: a.name, email: a.email, role: a.role }))}
      currentUserEmail={session.user.email!}
    />
  )
}
