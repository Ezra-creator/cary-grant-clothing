'use client'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

export function useScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrollPosition(latest)
    setIsScrolled(latest > 50)
  })

  return { scrollYProgress, scrollY, scrollPosition, isScrolled }
}
