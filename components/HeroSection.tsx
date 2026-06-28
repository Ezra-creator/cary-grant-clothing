'use client'
import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import Link from 'next/link'
import MagneticButton from '@/components/ui/MagneticButton'
import { useScrollProgress } from '@/hooks/useScrollProgress'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScrollProgress()

  /* Parallax */
  const videoY = useTransform(scrollY, [0, 600], [0, -150])

  /* Scroll indicator opacity */
  const indicatorOpacity = useTransform(scrollY, [0, 100], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* ── Parallax Video Background ── */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/brand-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ── Dark overlay gradient ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,20,20,0.35) 0%, rgba(10,10,10,0.55) 55%, rgba(8,8,8,0.92) 100%)',
        }}
      />

      {/* ── Grain texture overlay ── */}
      <div className="grain-overlay absolute inset-0 z-[2] pointer-events-none" />

      {/* ── Main Content ── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          className="font-mono text-[12px] tracking-[0.08em] mb-6 md:mb-8 text-cgc-red uppercase"
        >
          EST. 2002 — BARRIE, ONTARIO
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease }}
          className="font-archivo text-[36px] md:text-[58px] leading-[1.04] text-white max-w-[680px] mb-6 md:mb-8"
        >
          Built in the <span className="text-cgc-red">streets.</span> Worn everywhere.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease }}
          className="font-inter text-[16px] text-[#cfcfcf] mb-10 md:mb-12 max-w-[460px]"
        >
          From a duffle bag to owning the building.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease }}
          className="flex flex-row items-center justify-center gap-4"
        >
          <MagneticButton>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/shop"
                className="bg-cgc-red text-white px-9 py-[14px] rounded-cgc-md font-inter text-[16px] transition-all hover:bg-[#b8000d] hover:-translate-y-[1px] shadow-lg flex items-center justify-center"
              >
                Shop now
              </Link>
            </motion.div>
          </MagneticButton>

          <MagneticButton>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/about"
                className="bg-transparent border border-white text-white px-9 py-[14px] rounded-cgc-md font-inter text-[16px] transition-all hover:bg-white hover:text-cgc-ink hover:-translate-y-[1px] flex items-center justify-center"
              >
                Our story
              </Link>
            </motion.div>
          </MagneticButton>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] tracking-[0.08em] text-white/30 uppercase">
          Scroll
        </span>
        <div className="relative w-px h-[60px] bg-white/20 overflow-hidden">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
            animate={{ y: [0, 60] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear', repeatType: 'loop' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
