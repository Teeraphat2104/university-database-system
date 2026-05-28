import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavLinks } from "@/components/nav-links"

export async function Sidebar() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const role = (session.user as any).role

  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen border-r border-border">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
        <span className="text-sm font-semibold tracking-tight">University DB</span>
      </div>

      <div className="flex-1 py-3">
        <NavLinks role={role} />
      </div>

      <div className="py-3 space-y-1 border-t border-border px-3">
        <div className="px-3 py-1.5 text-[13px] text-muted-foreground">
          {session.user.name} ({role})
        </div>
        <div className="[&_button]:w-full [&_button]:flex [&_button]:items-center [&_button]:gap-3 [&_button]:rounded-lg [&_button]:px-3 [&_button]:py-2 [&_button]:text-sm [&_button]:text-sidebar-foreground/70 [&_button]:hover:text-primary [&_button]:hover:bg-primary/10 [&_button]:transition-colors">
          <ThemeToggle />
        </div>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
