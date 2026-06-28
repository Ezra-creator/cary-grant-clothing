'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User, signOut } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut, Menu, X, ExternalLink } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [router, pathname])

  const handleLogout = async () => {
    await signOut(auth)
    // Clear admin session cookie
    document.cookie = 'cgc-admin-token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image src="/images/logo.jpg" alt="CGC" width={48} height={48} className="animate-pulse object-contain" />
          <p className="font-inter text-[#6e6358] tracking-[0.3em] text-[10px]">Loading...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (!user) return null

  const currentLabel = navItems.find(n => n.href === pathname)?.label || 'Admin'

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-[260px] bg-[#0a0908] border-r border-white/5 z-40 flex flex-col transition-transform duration-300 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo Section */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <Image src="/images/logo.jpg" alt="CGC" width={48} height={48} className="object-contain" />
            <div>
              <p className="font-inter text-[11px] text-[#f5f0e8] tracking-[0.3em] leading-tight">Cary Grant</p>
              <p className="font-inter text-[8px] text-[#6e6358] tracking-[0.3em]">Clothing Co.</p>
            </div>
          </div>
          <div className="h-[1px] bg-white/5 mb-3" />
          <p className="font-inter text-[10px] text-[#6e6358] truncate">{user.email}</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 h-[48px] px-5 font-inter text-[11px] tracking-[0.2em] transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[rgba(201,168,76,0.08)] text-[var(--cgc-red)] border-l-2 border-[var(--cgc-red)] pl-4'
                    : 'text-[#6e6358] hover:text-[#f5f0e8] hover:bg-[rgba(245,240,232,0.03)]'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 h-[40px] px-5 font-inter text-[10px] tracking-[0.2em] text-[#6e6358] hover:text-[var(--cgc-red)] transition-colors"
          >
            <ExternalLink size={14} />
            View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 h-[40px] px-5 font-inter text-[10px] tracking-[0.2em] text-[#6e6358] hover:text-[var(--cgc-red)] transition-colors w-full"
          >
            <LogOut size={14} />
            Logout
          </button>
          <p className="font-inter text-[8px] text-[#6e6358] tracking-[0.3em] px-5 pt-1">v1.0.0</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 lg:left-[260px] right-0 h-[64px] bg-[#0a0908] border-b border-[rgba(201,168,76,0.1)] px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-[#6e6358] hover:text-[#f5f0e8] transition-colors">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <p className="font-inter text-[11px] tracking-[0.3em] text-[#f5f0e8]">{currentLabel}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-inter text-[11px] text-[#6e6358]">{user.email}</span>
            </div>
          </div>
        </div>

        <main className="flex-1 p-6 md:p-8 pt-[80px]">{children}</main>
      </div>
    </div>
  )
}
