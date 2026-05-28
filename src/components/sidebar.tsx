import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavLinks } from "@/components/nav-links"

export async function Sidebar() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const role = (session.user as any).role

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 flex flex-col gap-4 min-h-screen border-r border-white/5">
      <div className="text-lg font-semibold tracking-tight">University DB</div>

      <NavLinks role={role} />

      <div className="mt-auto space-y-1">
        <div className="[&_button]:text-sidebar-foreground/80 [&_button]:hover:bg-white/10 [&_button]:hover:text-sidebar-foreground [&_button]:rounded-md [&_button]:px-3 [&_button]:py-2 [&_button]:text-sm [&_button]:w-full [&_button]:text-left [&_button]:transition-colors">
          <ThemeToggle />
        </div>
        <div className="text-xs text-sidebar-foreground/60 px-3 py-1">
          {session.user.name} ({role})
        </div>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-sm text-left text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
