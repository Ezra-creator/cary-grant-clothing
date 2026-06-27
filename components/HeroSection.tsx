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
            'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.85) 100%)',
        }}
      />

      {/* ── Grain texture overlay ── */}
      <div className="grain-overlay absolute inset-0 z-[2] pointer-events-none" />

      {/* ── Gold vignette ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(201, 168, 76, 0.08) 100%)',
        }}
      />

      {/* ── Left: Social Links ── */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-center gap-6">
        {[
          { label: 'IG', href: 'https://instagram.com/cgclthn' },
          { label: 'TW', href: 'https://twitter.com/CG021' },
          { label: 'FB', href: 'https://facebook.com/Cary-Grant-Clothing-19389221599' },
        ].map((s, i) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.1, duration: 0.8, ease }}
            className="font-cinzel text-[9px] uppercase tracking-[0.3em] text-white/40 hover:text-[#c9a84c] transition-colors duration-300"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {s.label}
          </motion.a>
        ))}
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease }}
          className="w-px h-12 bg-white/20 mt-2 origin-top" 
        />
      </div>

      {/* ── Right: Brand tag ── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease }}
          className="font-cinzel text-[9px] uppercase tracking-[0.3em] text-white/40"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(0deg)' }}
        >
          CGC Est. 2002
        </motion.span>
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease }}
          className="w-px h-12 bg-white/20 mt-4 origin-top" 
        />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">

        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          className="font-cinzel text-[11px] uppercase tracking-[0.5em] mb-6 md:mb-8 text-[#c9a84c]"
        >
          Est. 2002 — Barrie, Ontario 🇨🇦
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease }}
          className="font-cinzel font-black uppercase leading-[0.9] tracking-[0.05em] mb-6 md:mb-8"
        >
          <span className="block text-white text-[44px] sm:text-[64px] md:text-[80px] lg:text-[96px]">
            BORN IN
          </span>
          <span
            className="block text-[44px] sm:text-[64px] md:text-[80px] lg:text-[96px] text-[#c9a84c]"
            style={{ textShadow: '0 0 60px rgba(201, 168, 76, 0.4)' }}
          >
            THE STREETS
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease }}
          className="font-inter text-[14px] md:text-[16px] uppercase tracking-[0.15em] mb-10 md:mb-12 max-w-md text-white/60"
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
                className="btn-primary block px-10 py-4"
              >
                Shop Now
              </Link>
            </motion.div>
          </MagneticButton>

          <MagneticButton>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/about"
                className="btn-secondary block px-10 py-4"
              >
                Our Story
              </Link>
            </motion.div>
          </MagneticButton>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-end gap-3"
      >
        <span
          className="font-cinzel text-[9px] uppercase tracking-[0.4em] text-white/30 whitespace-nowrap mb-6"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
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
