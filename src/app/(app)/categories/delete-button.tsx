"use client"

import { useActionState } from "react"
import { deleteCategoryAction } from "@/lib/actions/category"

export function DeleteCategoryButton({ id }: { id: string }) {
  const deleteWithId = deleteCategoryAction.bind(null, id)
  const [state, action, pending] = useActionState(deleteWithId, null)

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
    </form>
  )
}
