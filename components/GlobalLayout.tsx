'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import CookieBanner from '@/components/CookieBanner'
import BackToTop from '@/components/BackToTop'

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <CartDrawer />}
      <main id="main-content">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <CookieBanner />}
      {!isAdmin && <BackToTop />}
    </>
  )
}
