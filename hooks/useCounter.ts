'use client'
import { useState, useEffect, useRef, RefObject } from 'react'

interface UseCounterOptions {
  end: number
  duration?: number
  start?: number
}

interface UseCounterReturn {
  count: number
  ref: RefObject<HTMLElement>
}

export function useCounter({
  end,
  duration = 2000,
  start = 0,
}: UseCounterOptions): UseCounterReturn {
  const [count, setCount] = useState(start)
  const ref = useRef<HTMLElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          animateCount()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, start])

  const animateCount = () => {
    const startTime = performance.now()
    const range = end - start

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(start + range * eased))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  return { count, ref }
}
