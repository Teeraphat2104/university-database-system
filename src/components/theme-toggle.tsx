"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { IconSun, IconMoon } from "@tabler/icons-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button type="button" onClick={toggleTheme} className="relative flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] as const }}
        >
          {theme === "light" ? (
            <IconMoon className="h-[18px] w-[18px]" />
          ) : (
            <IconSun className="h-[18px] w-[18px]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
