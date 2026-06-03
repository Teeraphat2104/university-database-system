"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconFileDescription,
  IconUpload,
  IconFolder,
  IconShield,
  IconSettings,
  IconChevronRight,
  IconFiles,
} from "@tabler/icons-react"

export function TreeNav({ role }: { role: string }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    content: true,
    system: true,
  })

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <nav className="flex flex-col gap-0.5 px-3 pb-3">
      <TreeLeaf
        href="/dashboard"
        icon={<IconLayoutDashboard className="h-4 w-4" />}
        label="Dashboard"
        active={pathname === "/dashboard"}
        level={0}
      />

      <TreeBranch
        label="Content"
        icon={<IconFiles className="h-4 w-4" />}
        expanded={expanded.content}
        onToggle={() => toggle("content")}
        level={0}
      >
        <TreeLeaf
          href="/pdfs"
          icon={<IconFileDescription className="h-4 w-4" />}
          label="All PDFs"
          active={pathname === "/pdfs"}
          level={1}
        />
        <TreeLeaf
          href="/pdfs/upload"
          icon={<IconUpload className="h-4 w-4" />}
          label="Upload PDF"
          active={pathname === "/pdfs/upload"}
          level={1}
        />
      </TreeBranch>

      <TreeLeaf
        href="/categories"
        icon={<IconFolder className="h-4 w-4" />}
        label="Categories"
        active={pathname === "/categories"}
        level={0}
      />

      {role === "admin" && (
        <TreeBranch
          label="System"
          icon={<IconSettings className="h-4 w-4" />}
          expanded={expanded.system}
          onToggle={() => toggle("system")}
          level={0}
        >
          <TreeLeaf
            href="/admins"
            icon={<IconShield className="h-4 w-4" />}
            label="Manage Admins"
            active={pathname === "/admins"}
            level={1}
          />
          <TreeLeaf
            href="/settings"
            icon={<IconSettings className="h-4 w-4" />}
            label="Settings"
            active={pathname === "/settings"}
            level={1}
          />
        </TreeBranch>
      )}
    </nav>
  )
}

const LEVEL_PADDING: Record<number, string> = {
  0: "pl-3",
  1: "pl-[2.75rem]",
}

function TreeBranch({
  label,
  icon,
  expanded,
  onToggle,
  children,
  count,
  level,
}: {
  label: string
  icon: React.ReactNode
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
  count?: number
  level: number
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className={`w-full rounded-lg py-2 text-sm flex items-center gap-3 text-sidebar-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
          LEVEL_PADDING[level] ?? "pl-3"
        }`}
      >
        <IconChevronRight
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
        {icon}
        <span className="flex-1 text-left truncate">{label}</span>
        {count !== undefined && (
          <span className="text-xs text-muted-foreground">{count}</span>
        )}
      </button>
      {expanded && <div className="space-y-0.5">{children}</div>}
    </div>
  )
}

function TreeLeaf({
  href,
  icon,
  label,
  active,
  level,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  level: number
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg py-2 text-sm flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        LEVEL_PADDING[level] ?? "pl-3"
      } ${active ? "text-primary bg-primary/10" : "text-sidebar-foreground/80 hover:text-primary hover:bg-primary/10"}`}
    >
      <span className="w-[1.125rem]" />
      {icon}
      <span>{label}</span>
    </Link>
  )
}
