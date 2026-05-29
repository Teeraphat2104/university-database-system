"use client"

import { motion } from "framer-motion"
import { AnimatedGradient } from "./animated-gradient"
import { LandingSearch } from "@/app/landing-search"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
}

export function HeroSection({
  categories,
  years,
  months,
}: {
  categories: { id: string; name: string; imagePath?: string | null }[]
  years: number[]
  months: string[]
}) {
  return (
    <section className="relative min-h-[85vh] flex flex-col">
      <AnimatedGradient />

      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <motion.span
            className="text-sm font-semibold"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            University DB
          </motion.span>
          <motion.div
            className="flex items-center gap-2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium hover:brightness-110 transition-all"
            >
              Sign in
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Hero content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10">
        <div className="max-w-4xl w-full mx-auto text-center space-y-8">
          <motion.div
            className="space-y-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              University{" "}
              <span className="text-primary">Database</span> System
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Browse and search the university&apos;s archive of PDF documents,
              organized by category, year, and month.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="max-w-4xl mx-auto"
          >
            <LandingSearch
              categories={categories}
              years={years}
              months={months}
              hero
            />
          </motion.div>

          <motion.p
            className="text-xs text-muted-foreground"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Search thousands of documents across all categories and years
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-muted-foreground/60"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
