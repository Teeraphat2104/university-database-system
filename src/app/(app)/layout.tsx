import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { AppShell } from "@/components/app-shell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user
    ? { name: session.user.name ?? "", role: (session.user as any).role ?? "" }
    : { name: "", role: "" }

  return (
    <AppShell sidebar={<Sidebar />} user={user}>
      {children}
    </AppShell>
  )
}
