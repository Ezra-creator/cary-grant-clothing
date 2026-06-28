'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, Menu, X, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthContext } from '@/context/AuthContext'
import { logout } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { Product } from '@/types'
import { useScrollProgress } from '@/hooks/useScrollProgress'

/* ─── Static data ──────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop', hasMega: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const COLLECTIONS = [
  { name: "Men's",     slug: 'mens',       color: '#1a1010' },
  { name: "Women's",   slug: 'womens',     color: '#1a1018' },
  { name: 'African',   slug: 'african',    color: '#101a10' },
  { name: 'Activewear',slug: 'activewear', color: '#10101a' },
  { name: 'Kids',      slug: 'kids',       color: '#1a1a10' },
  { name: 'Footwear',  slug: 'footwear',   color: '#101a1a' },
]

const POPULAR_SEARCHES = ['Hoodies', 'Tracksuits', 'African Collection', "Women's Dresses"]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/cgclthn' },
  { label: 'Twitter',   href: 'https://twitter.com/CG021' },
  { label: 'Facebook',  href: 'https://facebook.com/Cary-Grant-Clothing-19389221599' },
  { label: 'TikTok',    href: 'https://tiktok.com/@carygrantclothing' },
  { label: 'Snapchat',  href: 'https://snapchat.com/add/cgclthn' },
]

/* ─── Mega Menu ────────────────────────────────────────────────── */
function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-0 right-0 bg-cgc-paper border-b border-cgc-hairline z-50"
      style={{ top: 0, paddingTop: '80px' }}
      onMouseLeave={onClose}
    >
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <p className="font-inter text-sm font-medium text-cgc-slate mb-8">
          Shop by collection
        </p>
        <div className="grid grid-cols-6 gap-4">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/shop?category=${col.slug}`}
              onClick={onClose}
              className="group flex flex-col items-center gap-3 p-4 rounded-cgc-lg border border-cgc-ink/5 hover:border-cgc-red/40 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border border-cgc-ink/10 group-hover:border-cgc-red/40 transition-colors"
                style={{ background: col.color }}
              >
                <span className="font-inter text-sm text-white/80 group-hover:text-cgc-red transition-colors">
                  {col.name.slice(0, 2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-inter text-sm font-medium text-cgc-ink group-hover:text-cgc-red transition-colors">
                  {col.name}
                </span>
                <ArrowRight size={14} className="text-white/0 group-hover:text-cgc-red transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Search Overlay ───────────────────────────────────────────── */
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSearch = useCallback((val: string) => {
    setSearchQuery(val)
    clearTimeout(debounceRef.current)
    if (val.length < 2) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const q = query(
          collection(db, 'products'),
          where('name', '>=', val),
          where('name', '<=', val + '\uf8ff'),
          limit(6)
        )
        const snap = await getDocs(q)
        setResults(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)))
      } catch { setResults([]) }
      finally { setIsSearching(false) }
    }, 300)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex flex-col bg-cgc-paper/95 backdrop-blur-md"
    >
      <div className="max-w-3xl mx-auto w-full px-6 pt-24 pb-12 flex flex-col gap-12">
        {/* Input */}
        <div className="relative flex items-center gap-4 border-b border-cgc-ink/20 pb-4">
          <Search size={24} className="text-cgc-ink/40 flex-shrink-0" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search CGC..."
            className="flex-1 bg-transparent font-inter text-3xl text-cgc-ink placeholder-cgc-ink/20 outline-none"
          />
          <button onClick={onClose} className="text-cgc-ink/40 hover:text-cgc-ink transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Popular searches */}
        {searchQuery.length < 2 && (
          <div>
            <p className="font-inter text-sm font-medium text-cgc-slate mb-4">
              Popular searches
            </p>
            <div className="flex flex-wrap gap-3">
              {POPULAR_SEARCHES.map(term => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 border border-cgc-ink/10 rounded-cgc-md font-inter text-sm text-cgc-slate hover:border-cgc-red hover:text-cgc-red transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {isSearching && (
          <p className="font-inter text-sm text-cgc-slate">Searching...</p>
        )}
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {results.map(product => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-cgc-lg border border-cgc-ink/5 hover:border-cgc-red/40 transition-all duration-200 group bg-white"
              >
                <div className="w-15 h-15 flex-shrink-0 bg-cgc-bone overflow-hidden rounded-cgc-md">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-inter text-sm text-cgc-ink group-hover:text-cgc-red transition-colors line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-cgc-red text-sm font-bold mt-1">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!isSearching && searchQuery.length >= 2 && results.length === 0 && (
          <p className="font-inter text-sm text-cgc-slate">
            No results for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Mobile Menu ──────────────────────────────────────────────── */
function MobileMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed inset-0 z-50 flex flex-col bg-cgc-paper"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-cgc-ink/60 hover:text-cgc-ink transition-colors"
      >
        <X size={28} />
      </button>

      {/* Logo */}
      <div className="flex flex-col items-center pt-16 pb-10">
        <Image src="/images/logo.jpg" alt="CGC" width={80} height={80} className="object-contain" />
      </div>

      {/* Nav Links */}
      <div className="flex flex-col items-center flex-1 overflow-y-auto">
        {NAV_LINKS.map((link, i) => (
          <div key={link.label} className="w-full">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className={`group flex items-center justify-center py-6 font-inter text-3xl font-medium transition-all duration-300 hover:text-cgc-red hover:translate-x-1 ${
                  pathname === link.href ? 'text-cgc-ink' : 'text-cgc-slate'
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
            {i < NAV_LINKS.length - 1 && (
              <div className="w-1/3 mx-auto h-px bg-cgc-red/20" />
            )}
          </div>
        ))}
      </div>

      {/* Footer: Follow Us */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-8 flex flex-col items-center gap-5"
      >
        <p className="font-inter text-sm font-medium text-cgc-slate">
          Follow us
        </p>
        <div className="flex items-center gap-6">
          {SOCIAL_LINKS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="font-inter text-sm font-medium text-cgc-slate hover:text-cgc-red transition-all duration-200 hover:scale-110"
            >
              {s.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Navbar ──────────────────────────────────────────────── */
export default function Navbar() {
  const { scrollPosition: scrollY } = useScrollProgress()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [badgePulse, setBadgePulse] = useState(false)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)

  const pathname = usePathname()
  const { user } = useAuthContext()
  const { items, itemCount, openCart } = useCartStore()
  const count = itemCount()
  const prevCountRef = useRef(0)
  const megaTimeout = useRef<NodeJS.Timeout>()
  const megaLeaveTimeout = useRef<NodeJS.Timeout>()
  const accountDropdownRef = useRef<HTMLDivElement>(null)

  const isScrolled = scrollY > 80

  /* Cart badge pulse */
  useEffect(() => {
    if (count > prevCountRef.current) {
      setBadgePulse(true)
      const t = setTimeout(() => setBadgePulse(false), 700)
      return () => clearTimeout(t)
    }
    prevCountRef.current = count
  }, [count])

  /* Close account dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /* Mega menu handlers */
  const handleCollectionsEnter = () => {
    clearTimeout(megaLeaveTimeout.current)
    megaTimeout.current = setTimeout(() => setMegaOpen(true), 200)
  }
  const handleCollectionsLeave = () => {
    clearTimeout(megaTimeout.current)
    megaLeaveTimeout.current = setTimeout(() => setMegaOpen(false), 300)
  }
  const handleMegaEnter = () => clearTimeout(megaLeaveTimeout.current)
  const handleMegaLeave = () => {
    megaLeaveTimeout.current = setTimeout(() => setMegaOpen(false), 300)
  }

  /* Navbar height */
  const navHeight = isScrolled ? 64 : 80

  return (
    <>
      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-cgc-paper border-b border-cgc-hairline transition-all duration-400"
        style={{ height: navHeight }}
      >
        <div
          className="flex items-center justify-between h-full px-8"
          style={{ maxWidth: 1400, margin: '0 auto' }}
        >
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="CGC Logo"
              width={48}
              height={48}
              className="object-contain transition-all duration-300"
              style={{ height: 48, width: 'auto' }}
            />
            <div className="flex flex-col leading-tight transition-all duration-400 overflow-hidden text-cgc-ink">
              <span className="font-inter text-sm font-semibold">
                Cary Grant
              </span>
              <span className="font-inter text-sm font-semibold">
                Clothing
              </span>
            </div>
          </Link>

          {/* ── Center Nav (desktop) ── */}
          <div className="hidden lg:flex items-center" style={{ gap: 48 }}>
            {NAV_LINKS.map(link => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={link.hasMega ? handleCollectionsEnter : undefined}
                onMouseLeave={link.hasMega ? handleCollectionsLeave : undefined}
              >
                <Link
                  href={link.href}
                  className={`font-inter text-sm font-medium transition-colors duration-300 relative group pb-1 ${
                    pathname === link.href
                      ? 'text-cgc-red'
                      : 'text-cgc-slate hover:text-cgc-ink'
                  }`}
                >
                  {link.label}
                  {/* Animated red underline */}
                  <span
                    className="absolute bottom-0 left-0 h-px bg-cgc-red transition-all duration-300 ease-out"
                    style={{ width: pathname === link.href ? '100%' : '0' }}
                  />
                  <span className="absolute bottom-0 left-0 h-px bg-cgc-red w-0 group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              </div>
            ))}
          </div>

          {/* ── Right Icons ── */}
          <div className="flex items-center text-cgc-ink" style={{ gap: 24 }}>
            <button
              onClick={() => setSearchOpen(true)}
              className="transition-colors duration-300 hover:text-cgc-red"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              onClick={openCart}
              className="relative transition-colors duration-300 hover:text-cgc-red"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <motion.span
                  animate={badgePulse ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute -top-2 -right-2 bg-cgc-red text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {count}
                </motion.span>
              )}
            </button>

            {/* Account Icon with Dropdown */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="transition-colors duration-300 hover:text-cgc-red"
                aria-label="Account"
              >
                <User size={20} />
              </button>

              {/* Account Dropdown */}
              <AnimatePresence>
                {accountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-[220px] bg-cgc-paper border border-cgc-hairline rounded-cgc-lg py-2 z-50 shadow-xl"
                  >
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-cgc-ink/5">
                          <p className="font-inter text-sm font-medium text-cgc-ink">
                            {user.displayName || 'Customer'}
                          </p>
                          <p className="font-inter text-xs text-cgc-slate truncate">
                            {user.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <Link
                          href="/account"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-3 font-inter text-sm text-cgc-slate hover:text-cgc-ink hover:bg-cgc-ink/5 transition-colors"
                        >
                          My account
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-3 font-inter text-sm text-cgc-slate hover:text-cgc-ink hover:bg-cgc-ink/5 transition-colors"
                        >
                          My orders
                        </Link>

                        {/* Divider */}
                        <div className="h-px bg-cgc-ink/5 my-2" />

                        {/* Sign Out */}
                        <button
                          onClick={async () => {
                            await logout()
                            setAccountDropdownOpen(false)
                          }}
                          className="w-full px-4 py-3 font-inter text-sm text-cgc-red hover:bg-cgc-ink/5 transition-colors text-left"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Not logged in */}
                        <Link
                          href="/auth"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-3 font-inter text-sm text-cgc-slate hover:text-cgc-ink hover:bg-cgc-ink/5 transition-colors"
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/auth"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-3 font-inter text-sm text-cgc-slate hover:text-cgc-ink hover:bg-cgc-ink/5 transition-colors"
                        >
                          Create account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden transition-colors text-cgc-ink hover:text-cgc-red"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Collections Mega Menu ── */}
      <AnimatePresence>
        {megaOpen && (
          <div onMouseEnter={handleMegaEnter} onMouseLeave={handleMegaLeave}>
            <MegaMenu onClose={() => setMegaOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
