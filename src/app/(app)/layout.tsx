import { Sidebar } from "@/components/sidebar"
import { AppShell } from "@/components/app-shell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sidebar={<Sidebar />}>
      {children}
    </AppShell>
  )
}
