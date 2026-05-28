import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export async function Sidebar() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const role = (session.user as any).role

  return (
    <aside className="w-64 border-r bg-background p-4 flex flex-col gap-4">
      <div className="text-lg font-semibold">University DB</div>

      <nav className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="rounded-md px-3 py-2 text-sm hover:bg-muted"
        >
          Dashboard
        </Link>
        <Link
          href="/pdfs"
          className="rounded-md px-3 py-2 text-sm hover:bg-muted"
        >
          PDFs
        </Link>
        <Link
          href="/pdfs/upload"
          className="rounded-md px-3 py-2 text-sm hover:bg-muted"
        >
          Upload PDF
        </Link>
        <Link
          href="/categories"
          className="rounded-md px-3 py-2 text-sm hover:bg-muted"
        >
          Categories
        </Link>
        {role === "admin" && (
          <Link
            href="/admins"
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Manage Admins
          </Link>
        )}
      </nav>

      <div className="mt-auto space-y-1">
        <ThemeToggle />
        <div className="text-xs text-muted-foreground px-3">
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
            className="w-full rounded-md px-3 py-2 text-sm text-left hover:bg-muted"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
