"use client"

import { useTheme } from "@/components/theme-provider"
import { IconSun, IconMoon } from "@tabler/icons-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button type="button" onClick={toggleTheme}>
      {theme === "light" ? (
        <IconMoon className="h-[18px] w-[18px]" />
      ) : (
        <IconSun className="h-[18px] w-[18px]" />
      )}
      <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  )
}
