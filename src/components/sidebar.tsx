import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TreeNav } from "@/components/tree-nav"

export async function Sidebar() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="w-60 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-border">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-border shrink-0">
        <span className="text-sm font-semibold tracking-tight">University DB</span>
      </div>

      <div className="flex-1 py-3 overflow-y-auto">
        <TreeNav role={(session.user as any).role} />
      </div>
    </div>
  )
}
