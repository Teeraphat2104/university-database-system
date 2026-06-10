"use client"

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  name?: string
  required?: boolean
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  name,
  required,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const selected = options.find((o) => o.value === value)

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    updatePos()
    window.addEventListener("scroll", updatePos, true)
    window.addEventListener("resize", updatePos)
    return () => {
      window.removeEventListener("scroll", updatePos, true)
      window.removeEventListener("resize", updatePos)
    }
  }, [open, updatePos])

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) return
      setOpen(false)
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [open])

  function handleSelect(opt: SelectOption) {
    onChange(opt.value)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    const currentIdx = options.findIndex((o) => o.value === value)
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (currentIdx < options.length - 1) onChange(options[currentIdx + 1].value)
        break
      case "ArrowUp":
        e.preventDefault()
        if (currentIdx > 0) onChange(options[currentIdx - 1].value)
        break
      case "Enter":
        e.preventDefault()
        setOpen(false)
        break
      case "Escape":
        setOpen(false)
        break
    }
  }

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm text-left transition-all",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          !selected && "text-muted-foreground",
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-muted-foreground"
        >
          <IconChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {name && (
        <input type="hidden" name={name} value={value} required={required} />
      )}

      <AnimatePresence>
        {open && (() => {
          const panel = (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.25, 0.4, 0.25, 1] as const }}
              style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
              className={cn("bg-background border border-border rounded-lg shadow-lg overflow-hidden")}
            >
              <div className="py-1 max-h-60 overflow-y-auto">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-muted",
                      opt.value === value && "bg-primary/5 text-primary font-medium",
                    )}
                  >
                    <span className="w-4 shrink-0">
                      {opt.value === value && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )
          // Use document.body for portal to avoid clipping and stacking issues in modals
          return createPortal(panel, document.body)
        })()}
      </AnimatePresence>
    </div>
  )
}
