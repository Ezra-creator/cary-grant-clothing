'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const pref = localStorage.getItem('cgc-cookie-consent')
    if (!pref) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cgc-cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cgc-cookie-consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-cgc-ink border-t border-white/[0.1] px-4 py-4 md:px-8 md:py-5"
        >
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-inter text-[10px] tracking-[0.3em] text-cgc-red mb-1">Cookie Notice</p>
              <p className="font-inter text-[13px] text-gray-400">
                We use cookies to improve your experience on our site. By continuing, you agree to our use of cookies.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={decline}
                className="font-inter text-[10px] tracking-[0.3em] px-5 py-2.5 border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="font-inter text-[10px] tracking-[0.3em] px-5 py-2.5 bg-cgc-red hover:bg-cgc-red-hover text-white transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
