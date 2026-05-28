import Link from "next/link"
import { IconChevronRight } from "@tabler/icons-react"

type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1">
              {i > 0 && <IconChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />}
              {isLast || !item.href ? (
                <span className={isLast ? "text-foreground font-medium" : ""}>{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
