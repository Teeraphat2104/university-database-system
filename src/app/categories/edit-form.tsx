"use client"

import { useActionState, useState } from "react"
import { updateCategoryAction } from "@/lib/actions/category"

export function EditCategoryForm({
  category,
}: {
  category: { id: string; name: string }
}) {
  const [editing, setEditing] = useState(false)

  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      formData.set("id", category.id)
      const result = await updateCategoryAction(formData)
      if (!result.error) setEditing(false)
      return result
    },
    null,
  )

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Edit
      </button>
    )
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <input
        name="name"
        defaultValue={category.name}
        className="rounded border px-2 py-1 text-xs"
        required
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-green-600 disabled:opacity-50"
      >
        {pending ? "..." : "Save"}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-xs text-muted-foreground"
      >
        Cancel
      </button>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
    </form>
  )
}
