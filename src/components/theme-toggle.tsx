"use client"

import { useTheme } from "@/components/theme-provider"
import { IconSun, IconMoon } from "@tabler/icons-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md px-3 py-2 text-sm hover:bg-muted flex items-center gap-2 w-full"
    >
      {theme === "light" ? (
        <IconMoon className="h-4 w-4" />
      ) : (
        <IconSun className="h-4 w-4" />
      )}
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  )
}
