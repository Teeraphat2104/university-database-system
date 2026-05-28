"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/modal"
import { IconUserPlus, IconTrash } from "@tabler/icons-react"
import { createAdminAction, deleteAdminAction } from "@/lib/actions/admin"
import { useActionState } from "react"

function CreateAdminForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error: string | null } | null, formData: FormData) => {
      const res = await createAdminAction(formData)
      if (!res.error) onSuccess()
      return res
    },
    null,
  )

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" name="name" required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="role" className="text-sm font-medium">Role</label>
        <select id="role" name="role" required className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {state?.error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-600 dark:text-red-400">{state.error}</div>
      )}
      <div className="flex gap-2 justify-end">
        <button type="submit" disabled={pending} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
          {pending ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  )
}

export function AdminsClient({
  admins,
  currentUserEmail,
}: {
  admins: { id: string; name: string; email: string; role: string }[]
  currentUserEmail: string
}) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deletePending, setDeletePending] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeletePending(true)
    await deleteAdminAction(deleteTarget.id)
    setDeletePending(false)
    setDeleteTarget(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Admins</h1>
          <p className="text-sm text-muted-foreground mt-1">Add or remove system users</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
        >
          <IconUserPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="border rounded-lg divide-y">
        {admins.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.email} &middot; {a.role}</p>
            </div>
            {a.email !== currentUserEmail && (
              <button
                onClick={() => setDeleteTarget({ id: a.id, name: a.name })}
                className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                <IconTrash className="h-3 w-3" /> Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add User">
        <CreateAdminForm onSuccess={() => { setCreateOpen(false); router.refresh() }} />
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setDeleteTarget(null)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deletePending}
            className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all"
          >
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
