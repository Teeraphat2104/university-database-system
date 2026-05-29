"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <div className="flex min-h-screen">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-40 h-screen transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 rounded-lg p-1 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Close menu"
          >
            <IconX className="h-5 w-5" />
          </button>
          {sidebar}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <Topbar userName={user.name} role={user.role} onOpenSidebar={() => setOpen(true)} />
        <div className="flex-1 p-4 md:p-6 mx-auto w-full max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
