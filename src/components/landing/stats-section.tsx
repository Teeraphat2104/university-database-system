"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useSpring, useTransform, useMotionValueEvent } from "framer-motion"
import {
  IconFileDescription,
  IconFolder,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react"

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const spring = useSpring(0, { stiffness: 60, damping: 20 })
  const display = useTransform(spring, (v) => `${Math.floor(v)}${suffix}`)
  const [text, setText] = useState("0")

  useMotionValueEvent(display, "change", (v) => setText(v))

  useEffect(() => {
    if (inView) spring.set(value)
  }, [inView, value, spring])

  return <span ref={ref}>{text}</span>
}

const stats = [
  {
    label: "Total PDFs",
    getValue: (data: StatsData) => data.pdfCount,
    icon: IconFileDescription,
    color: "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400",
    gradient: "from-orange-50 to-transparent dark:from-orange-950/10",
  },
  {
    label: "Categories",
    getValue: (data: StatsData) => data.categoryCount,
    icon: IconFolder,
    color: "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
    gradient: "from-blue-50 to-transparent dark:from-blue-950/10",
  },
  {
    label: "Users",
    getValue: (data: StatsData) => data.userCount,
    icon: IconUsers,
    color: "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
    gradient: "from-purple-50 to-transparent dark:from-purple-950/10",
  },
  {
    label: "This Month",
    getValue: (data: StatsData) => data.pdfsThisMonth,
    icon: IconCalendar,
    color: "bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400",
    gradient: "from-teal-50 to-transparent dark:from-teal-950/10",
  },
]

type StatsData = {
  pdfCount: number
  categoryCount: number
  userCount: number
  pdfsThisMonth: number
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export function StatsSection({ data }: { data: StatsData }) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className={`border border-border rounded-xl p-5 space-y-2 hover:shadow-sm transition-shadow bg-gradient-to-br ${stat.gradient}`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              <AnimatedCounter value={stat.getValue(data)} />
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
