"use client"

import { useActionState } from "react"
import { createAdminAction } from "@/lib/actions/admin"
import { useRouter } from "next/navigation"

export function CreateAdminForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      const result = await createAdminAction(formData)
      if (!result.error) router.push("/admins")
      return result
    },
    null,
  )

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" name="name" required className="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" required className="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>
      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">Role</label>
        <select id="role" name="role" className="w-full rounded-lg border px-3 py-2 text-sm">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create User"}
      </button>
    </form>
  )
}
