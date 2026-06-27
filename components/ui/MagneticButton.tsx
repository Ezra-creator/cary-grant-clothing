'use client'
import { useRef, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
}

const MAX_OFFSET = 8

export default function MagneticButton({ children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, { stiffness: 300, damping: 20, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 300, damping: 20, mass: 0.5 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disabled on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    // Clamp to max offset
    const clampedX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, deltaX * 0.3))
    const clampedY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, deltaY * 0.3))

    rawX.set(clampedX)
    rawY.set(clampedY)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}
