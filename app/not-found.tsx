'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen bg-cgc-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(230,51,51,0.04) 0%, transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(230,51,51,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(230,51,51,0.04) 0%, transparent 50%)',
          animation: 'drift 12s ease-in-out infinite alternate',
        }}
      />

      {/* CGC Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-cinzel text-[30vw] font-black text-white/[0.02] leading-none">CGC</span>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <img src="/images/logo.jpg" alt="CGC" className="w-16 h-16 object-contain opacity-80" />
        </motion.div>

        {/* 404 */}
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-cinzel text-[120px] md:text-[160px] font-black text-cgc-red leading-none"
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-cinzel text-[24px] text-white uppercase tracking-[0.3em] mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-inter text-gray-500 text-[14px] mb-10 max-w-[380px] mx-auto"
        >
          The page you're looking for has moved, or it never existed. Let's get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <Link
            href="/"
            className="bg-cgc-red hover:bg-cgc-red-hover text-white font-cinzel text-[12px] uppercase tracking-[0.3em] px-8 py-4 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="border border-white/20 hover:border-white/50 text-white font-cinzel text-[12px] uppercase tracking-[0.3em] px-8 py-4 transition-colors"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, -20px); }
        }
      `}} />
    </div>
  )
}
