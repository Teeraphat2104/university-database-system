"use client"

import { useState } from "react"
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

  return (
    <div className="flex min-h-screen">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`w-60 bg-sidebar border-r border-border flex flex-col shrink-0 fixed top-0 left-0 z-40 h-screen transition-transform duration-200 md:static md:z-auto md:h-screen md:transition-none ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="relative h-full flex flex-col overflow-hidden">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-10 rounded-lg p-1 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Close menu"
          >
            <IconX className="h-5 w-5" />
          </button>
          {sidebar}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
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
