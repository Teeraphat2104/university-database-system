"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Modal } from "@/components/modal"
import { usePersistedState } from "@/hooks/use-persisted-state"
import {
  IconUserPlus, IconTrash, IconTable, IconLayoutGrid,
  IconUser, IconShield, IconEdit,
} from "@tabler/icons-react"
import { Select, type SelectOption } from "@/components/ui/select"
import { createAdminAction, deleteAdminAction } from "@/lib/actions/admin"

type ViewMode = "table" | "card"

function CreateAdminForm({ onSuccess }: { onSuccess: () => void }) {
  const [role, setRole] = useState("editor")
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
        <label className="text-sm font-medium">Role</label>
        <Select
          options={[
            { value: "editor", label: "Editor" },
            { value: "admin", label: "Admin" },
          ]}
          value={role}
          onChange={setRole}
          name="role"
          required
        />
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

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    editor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles[role] || "bg-muted text-muted-foreground"}`}>
      {role === "admin" ? <IconShield className="h-3 w-3" /> : <IconEdit className="h-3 w-3" />}
      {role}
    </span>
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
  const [view, setView] = usePersistedState<ViewMode>("view-admins", "table")
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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Admins</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {admins.length} user{admins.length === 1 ? "" : "s"} &middot;{" "}
            {admins.filter((a) => a.role === "admin").length} admin{admins.filter((a) => a.role === "admin").length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <button
              onClick={() => setView("table")}
              className={`p-1.5 text-sm transition-colors ${view === "table" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Table view"
            >
              <IconTable className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("card")}
              className={`p-1.5 text-sm transition-colors ${view === "card" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Card view"
            >
              <IconLayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <IconUserPlus className="h-4 w-4" /> Add User
          </button>
        </div>
      </div>

      {/* Table view */}
      {view === "table" && (
        <div className="overflow-x-auto">
          <div className="border border-border min-w-[500px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-10">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-28">Role</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((a, i) => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{a.name}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{a.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={a.role} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {a.email !== currentUserEmail && (
                        <button
                          onClick={() => setDeleteTarget({ id: a.id, name: a.name })}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          title="Delete"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <IconUserPlus className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium mt-2">No users yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Create the first user to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Card view */}
      {view === "card" && (
        <>
          {admins.length === 0 ? (
            <div className="border border-dashed border-border px-4 py-16 text-center space-y-2">
              <IconUserPlus className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">No users yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Create the first user to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {admins.map((a) => (
                <div
                  key={a.id}
                  className="group border border-border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <IconUser className={`h-5 w-5 mt-0.5 ${
                      a.role === "admin" ? "text-purple-600 dark:text-purple-300" : "text-blue-600 dark:text-blue-300"
                    }`} />
                    {a.email !== currentUserEmail && (
                      <button
                        onClick={() => setDeleteTarget({ id: a.id, name: a.name })}
                        className="opacity-0 group-hover:opacity-100 rounded-md p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                        title="Delete"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.email}</p>
                  </div>
                  <RoleBadge role={a.role} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add User">
        <CreateAdminForm onSuccess={() => { setCreateOpen(false); router.refresh() }} />
      </Modal>

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={deletePending} className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
