"use client"

import { useTheme } from "@/components/theme-provider"
import { IconSun, IconMoon } from "@tabler/icons-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="relative flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {theme === "light" ? (
        <IconMoon className="h-[18px] w-[18px]" />
      ) : (
        <IconSun className="h-[18px] w-[18px]" />
      )}
    </button>
  )
}
