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
        // ── CGC Design Token Palette ──────────────────────────────
        'cgc-paper':    '#FFFFFF',   // bg-cgc-paper
        'cgc-bone':     '#FAF9F6',   // bg-cgc-bone
        'cgc-ink':      '#141414',   // text-cgc-ink / bg-cgc-ink
        'cgc-red':      '#E0102A',   // text-cgc-red / bg-cgc-red
        'cgc-slate':    '#6E6B66',   // text-cgc-slate
        'cgc-hairline': '#E6E3DD',   // border-cgc-hairline
      },
      fontFamily: {
        // Inter — all UI, nav, body, buttons, forms, admin, footer
        inter:    ['var(--font-inter)',         'sans-serif'],
        // Archivo Black — hero headline ONLY
        archivo:  ['var(--font-archivo-black)', 'sans-serif'],
        // IBM Plex Mono — swing-tag component ONLY (prices, category labels)
        mono:     ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      borderRadius: {
        'cgc-sm': '4px',   // tags                — rounded-cgc-sm
        'cgc-md': '8px',   // buttons, inputs      — rounded-cgc-md
        'cgc-lg': '12px',  // cards                — rounded-cgc-lg
        'cgc-xl': '16px',  // modals, drawers      — rounded-cgc-xl
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'slide-in':   'slideIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)'     },
        },
      },
    },
  },
  plugins: [],
}
export default config
