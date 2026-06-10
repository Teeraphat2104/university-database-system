"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { IconX } from "@tabler/icons-react"
import { Topbar } from "./topbar"

export function AppShell({
  sidebar,
  user,
  children,
}: {
  sidebar: React.ReactNode
  user: { name: string; role: string }
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
      if (e.key !== "Tab") return
      const el = sidebarRef.current
      if (!el) return
      const focusable = el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <div className="flex min-h-screen">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label="Navigation menu"
        className={`w-60 bg-sidebar border-r border-border flex flex-col shrink-0 fixed top-0 left-0 z-40 h-screen transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="relative h-full flex flex-col overflow-hidden">
          <button
            ref={closeRef}
            onClick={close}
            className="absolute top-3 right-3 z-10 p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
            aria-label="Close menu"
          >
            <IconX className="h-5 w-5" />
          </button>
          {sidebar}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 md:ml-60">
        <Topbar
          userName={user.name}
          role={user.role}
          onOpenSidebar={() => setOpen(true)}
        />
        <div className="flex-1 p-4 md:p-6 mx-auto w-full max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
