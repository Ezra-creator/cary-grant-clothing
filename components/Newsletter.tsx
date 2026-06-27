'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'newsletters'), {
        email,
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      toast.success('Welcome to the CGC family!')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 bg-cgc-black relative overflow-hidden">
      {/* Gold glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <p className="font-cinzel text-[#c9a84c] uppercase tracking-[0.4em] text-xs mb-4">Exclusive Access</p>
          <h2 className="section-heading mb-4">Join The Movement</h2>
          <div className="gold-underline mb-8" />
          <p className="text-cgc-gray-2 font-inter mb-10 leading-relaxed">
            Be the first to know about new drops, exclusive offers and CGC events.<br />
            No spam. Just heat.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-cgc-surface border border-[#c9a84c]/30 p-8 rounded">
              <p className="font-cinzel text-2xl text-cgc-white mb-2">YOU'RE IN ✓</p>
              <p className="text-cgc-gray-2 font-inter text-sm">Welcome to the CGC family. Watch your inbox.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-cgc-surface border border-white/10 focus:border-[#c9a84c] outline-none px-6 py-4 text-cgc-white font-inter placeholder-cgc-gray-2/50 transition-colors duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 whitespace-nowrap">
                {loading ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          )}

          <p className="text-cgc-gray-2/50 text-xs font-inter mt-4 flex items-center justify-center gap-2">
            🔒 We never share your data. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
