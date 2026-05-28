"use client"

import { useActionState } from "react"
import { createCategoryAction } from "@/lib/actions/category"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function CreateCategoryForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      return createCategoryAction(formData)
    },
    null,
  )

  useEffect(() => {
    if (state && !state.error) router.push("/categories")
  }, [state, router])

  return (
    <form action={action} className="max-w-md space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">Category Name</label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all"
      >
        {pending ? "Creating..." : "Create Category"}
      </button>
    </form>
  )
}
