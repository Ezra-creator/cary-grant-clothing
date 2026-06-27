import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cgc-black': '#0d0d0d',
        'cgc-surface': '#161616',
        'cgc-surface-2': '#1f1f1f',
        'cgc-surface-3': '#252525',
        'cgc-sidebar-bg': '#0a0908',
        'cgc-gold': '#c9a84c',
        'cgc-gold-light': '#e2c06e',
        'cgc-gold-dark': '#a8873a',
        'cgc-gold-subtle': 'rgba(201,168,76,0.08)',
        'cgc-gold-border': 'rgba(201,168,76,0.2)',
        'cgc-white': '#f5f0e8',
        'cgc-white-2': '#ede8e0',
        'cgc-gray-1': '#a09888',
        'cgc-gray-2': '#6e6358',
        'cgc-gray-3': 'rgba(245,240,232,0.06)',
        'cgc-red': '#cc2222',
        'cgc-success': '#22c55e',
        'cgc-error': '#ef4444',
        'cgc-warning': '#f59e0b',
        'cgc-light-bg': '#f5f0e8',
        'cgc-footer-bg': '#080807',
        'cgc-testimonials-bg': '#0f0e0c',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
