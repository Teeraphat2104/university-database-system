"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconFileDescription,
  IconUpload,
  IconFolder,
  IconShield,
} from "@tabler/icons-react"

const linkIcons: Record<string, React.ReactNode> = {
  "/dashboard": <IconLayoutDashboard className="h-4 w-4" />,
  "/pdfs": <IconFileDescription className="h-4 w-4" />,
  "/pdfs/upload": <IconUpload className="h-4 w-4" />,
  "/categories": <IconFolder className="h-4 w-4" />,
  "/admins": <IconShield className="h-4 w-4" />,
}

export function NavLinks({ role }: { role: string }) {
  const pathname = usePathname()

  const isPdfActive = pathname.startsWith("/pdfs")
  const isUploadActive = pathname === "/pdfs/upload"

  const topLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <IconLayoutDashboard className="h-4 w-4" /> },
    { href: "/categories", label: "Categories", icon: <IconFolder className="h-4 w-4" /> },
    ...(role === "admin" ? [{ href: "/admins", label: "Manage Admins", icon: <IconShield className="h-4 w-4" /> }] : []),
  ]

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {topLinks.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm flex items-center gap-3 transition-colors ${
              isActive
                ? "text-primary bg-primary/10"
                : "text-sidebar-foreground/80 hover:text-primary hover:bg-primary/10"
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        )
      })}

      {/* PDFs section */}
      <Link
        href="/pdfs"
        className={`rounded-lg px-3 py-2 text-sm flex items-center gap-3 transition-colors ${
          isPdfActive
            ? "text-primary bg-primary/10"
            : "text-sidebar-foreground/80 hover:text-primary hover:bg-primary/10"
        }`}
      >
        <IconFileDescription className="h-4 w-4" />
        <span>PDFs</span>
      </Link>
      <Link
        href="/pdfs/upload"
        className={`rounded-lg pl-10 pr-3 py-1.5 text-xs flex items-center gap-3 transition-colors ${
          isUploadActive
            ? "text-primary bg-primary/10"
            : "text-sidebar-foreground/60 hover:text-primary hover:bg-primary/10"
        }`}
      >
        <IconUpload className="h-3.5 w-3.5" />
        <span>Upload PDF</span>
      </Link>
    </nav>
  )
}
