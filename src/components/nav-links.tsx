"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavLinks({ role }: { role: string }) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pdfs", label: "PDFs" },
    { href: "/pdfs/upload", label: "Upload PDF" },
    { href: "/categories", label: "Categories" },
    ...(role === "admin" ? [{ href: "/admins", label: "Manage Admins" }] : []),
  ]

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {links.map((link) => {
        const isActive = pathname === link.href
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
            <span className="nav-text">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
