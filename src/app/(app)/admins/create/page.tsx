import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreateAdminForm } from "./create-form"

export default async function CreateAdminPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") redirect("/dashboard")

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Add User</h1>
      <CreateAdminForm />
    </div>
  )
}
