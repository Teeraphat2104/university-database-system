"use client"

import { useActionState } from "react"
import { createCategoryAction } from "@/lib/actions/category"
import { useRouter } from "next/navigation"

export function CreateCategoryForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      const result = await createCategoryAction(formData)
      if (!result.error) router.push("/categories")
      return result
    },
    null,
  )

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Category Name</label>
        <input id="name" name="name" required className="w-full rounded-lg border px-3 py-2 text-sm" />
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Category"}
      </button>
    </form>
  )
}
