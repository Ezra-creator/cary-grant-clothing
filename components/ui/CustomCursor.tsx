'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Dot follows cursor exactly
  const dotX = useSpring(mouseX, { stiffness: 800, damping: 35, mass: 0.2 })
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 35, mass: 0.2 })

  // Ring follows with a spring delay
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 })

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setIsVisible(true)
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)
    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(true)
      }
    }

    const onHoverEnd = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousemove', onHoverStart)
    window.addEventListener('mouseover', onHoverStart)
    window.addEventListener('mouseout', onHoverEnd)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousemove', onHoverStart)
      window.removeEventListener('mouseover', onHoverStart)
      window.removeEventListener('mouseout', onHoverEnd)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [mouseX, mouseY])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <>
      {/* Small red dot — follows exactly */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 2 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ scale: { duration: 0.1 } }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cgc-red pointer-events-none z-[9999]"
      />

      {/* Larger ring — spring-delayed */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          borderColor: isHovering ? 'var(--cgc-red)' : 'rgba(248,248,248,0.8)',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
          borderColor: { duration: 0.2 },
          opacity: { duration: 0.2 },
        }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cgc-white bg-transparent pointer-events-none z-[9998]"
      />
    </>
  )
}
