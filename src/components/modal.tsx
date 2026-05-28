"use client"

import { IconX } from "@tabler/icons-react"
import { useEffect, useRef } from "react"

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onClose={onClose}
      className={`fixed inset-0 z-50 m-auto w-full rounded-xl border border-border bg-background p-0 shadow-lg open:flex open:flex-col ${wide ? "max-w-2xl" : "max-w-md"}`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  )
}
