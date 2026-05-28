"use client"

import { useActionState } from "react"
import { deleteAdminAction } from "@/lib/actions/admin"

export function DeleteAdminButton({ id }: { id: string }) {
  const deleteWithId = deleteAdminAction.bind(null, id)
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
