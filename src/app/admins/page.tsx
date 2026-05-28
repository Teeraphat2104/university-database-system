import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { DeleteAdminButton } from "./delete-button"

export default async function AdminsPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") redirect("/dashboard")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Admins</h1>
        <Link
          href="/admins/create"
          className="rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          Add User
        </Link>
      </div>

      <div className="border rounded-lg divide-y">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${user.role === "admin" ? "border-blue-500 text-blue-600" : "border-gray-300"}`}>
                {user.role}
              </span>
              <DeleteAdminButton id={user.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
