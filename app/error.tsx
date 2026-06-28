'use client'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-cgc-ink flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-red-900/5 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-[480px]">
        <img src="/images/logo.jpg" alt="CGC" className="w-12 h-12 object-contain mx-auto mb-8 opacity-60" />
        <h1 className="font-inter text-[56px] text-cgc-red font-black leading-none mb-4">Error</h1>
        <div className="w-[60px] h-[2px] bg-cgc-red mx-auto mb-6" />
        <p className="font-inter text-[18px] text-white mb-3">Something went wrong</p>
        <p className="font-inter text-gray-500 text-[13px] mb-10 leading-relaxed">
          {error?.message || 'An unexpected error occurred. Please try again or return to the homepage.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="bg-cgc-red hover:bg-cgc-red-hover text-white font-inter text-[12px] tracking-[0.3em] px-8 py-4 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-white/20 hover:border-white/50 text-white font-inter text-[12px] tracking-[0.3em] px-8 py-4 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
