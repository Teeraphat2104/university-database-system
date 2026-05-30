"use client"

import { useRef, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { logoutAction } from "@/lib/actions/logout"
import { Modal } from "@/components/modal"

export function Topbar({ userName, role, onOpenSidebar }: { userName: string; role: string; onOpenSidebar?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="sticky top-0 z-30 bg-background flex items-center justify-between px-4 md:px-6 h-14 border-b border-border shrink-0">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-lg p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground transition-colors md:hidden"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-menu-2"><path d="M4 6l16 0"></path><path d="M4 12l16 0"></path><path d="M4 18l16 0"></path></svg>
      </button>
      <span className="text-sm text-muted-foreground hidden md:block">
        {userName} ({role})
      </span>
      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setShowLogout(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          Sign out
        </button>
        <form ref={formRef} action={logoutAction} className="hidden" />
      </div>

      <Modal open={showLogout} onClose={() => setShowLogout(false)} title="Sign out">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to sign out?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowLogout(false)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => formRef.current?.requestSubmit()}
            className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:brightness-110 transition-all"
          >
            Sign out
          </button>
        </div>
      </Modal>
    </div>
  )
}
