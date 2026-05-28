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
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-white/15 text-sidebar-foreground"
                : "text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground"
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
