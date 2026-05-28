import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { DeleteAdminButton } from "./delete-button"
import { IconUserPlus } from "@tabler/icons-react"

export default async function AdminsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if ((session.user as any).role !== "admin") redirect("/dashboard")

  const admins = await prisma.user.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Admins</h1>
          <p className="text-sm text-muted-foreground mt-1">Add or remove system users</p>
        </div>
        <Link
          href="/admins/create"
          className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
        >
          <IconUserPlus className="h-4 w-4" /> Add User
        </Link>
      </div>

      <div className="border rounded-lg divide-y">
        {admins.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.email} &middot; {a.role}</p>
            </div>
            {session.user && a.email !== session.user.email && <DeleteAdminButton id={a.id} />}
          </div>
        ))}
      </div>
    </div>
  )
}
