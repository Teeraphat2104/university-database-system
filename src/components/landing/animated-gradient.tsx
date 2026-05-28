"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const blobs = [
  {
    initial: { x: "10%", y: "20%" },
    animate: { x: ["10%", "60%", "30%", "10%"], y: ["20%", "10%", "50%", "20%"] },
    size: 600,
    color: "rgba(56, 189, 248, 0.15)",
    duration: 25,
  },
  {
    initial: { x: "60%", y: "10%" },
    animate: { x: ["60%", "20%", "70%", "60%"], y: ["10%", "60%", "30%", "10%"] },
    size: 500,
    color: "rgba(99, 102, 241, 0.12)",
    duration: 30,
  },
  {
    initial: { x: "30%", y: "60%" },
    animate: { x: ["30%", "70%", "40%", "30%"], y: ["60%", "20%", "70%", "60%"] },
    size: 450,
    color: "rgba(20, 184, 166, 0.1)",
    duration: 20,
  },
  {
    initial: { x: "70%", y: "50%" },
    animate: { x: ["70%", "30%", "80%", "70%"], y: ["50%", "70%", "20%", "50%"] },
    size: 350,
    color: "rgba(167, 139, 250, 0.1)",
    duration: 35,
  },
]

export function AnimatedGradient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            background: blob.color,
          }}
          initial={blob.initial}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />
    </div>
  )
}
