'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { Package, ShoppingBag, TrendingUp, Clock } from 'lucide-react'
import { Order } from '@/types'
import { motion } from 'framer-motion'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-900/30 text-amber-400 border border-amber-800/50',
  processing: 'bg-blue-900/30 text-blue-400 border border-blue-800/50',
  shipped: 'bg-purple-900/30 text-purple-400 border border-purple-800/50',
  delivered: 'bg-green-900/30 text-green-400 border border-green-800/50',
  cancelled: 'bg-red-900/30 text-red-400 border border-red-800/50',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsSnap, ordersSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5))),
        ])
        const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
        const revenue = orders.reduce((acc, o) => acc + (o.total || 0), 0)
        const pending = orders.filter(o => o.status === 'pending').length
        setStats({ products: productsSnap.size, orders: orders.length, revenue, pending })
        setRecentOrders(orders)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, accent: 'text-[#c9a84c]', border: 'border-[#c9a84c]', bg: 'bg-[#c9a84c]/10' },
    { label: 'Recent Orders', value: stats.orders, icon: ShoppingBag, accent: 'text-[#c9a84c]', border: 'border-[#c9a84c]', bg: 'bg-[#c9a84c]/10' },
    { label: 'Revenue (Recent)', value: `$${stats.revenue.toFixed(2)}`, icon: TrendingUp, accent: 'text-[#22c55e]', border: 'border-[#22c55e]', bg: 'bg-[#22c55e]/10' },
    { label: 'Pending Orders', value: stats.pending, icon: Clock, accent: 'text-[#f59e0b]', border: 'border-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-10">
        <p className="font-cinzel text-[10px] uppercase tracking-[0.5em] text-[#c9a84c] mb-2">Overview</p>
        <h1 className="font-cinzel text-[28px] text-[#f5f0e8] uppercase tracking-wide">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, accent, border, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className={`bg-[#161616] border ${border} border-opacity-20 p-6 relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-[80px] h-[80px] ${bg} blur-[40px] pointer-events-none`} />
            <div className="flex items-center justify-between mb-4">
              <p className="font-cinzel text-[9px] uppercase tracking-[0.4em] text-[#6e6358]">{label}</p>
              <div className={`w-8 h-8 flex items-center justify-center ${bg} rounded`}>
                <Icon size={16} className={accent} />
              </div>
            </div>
            <p className={`font-cinzel text-[32px] font-black ${accent} leading-none`}>
              {loading ? <span className="text-[#6e6358]">—</span> : value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="bg-[#161616] border border-[rgba(245,240,232,0.05)]"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(201,168,76,0.1)]">
          <h2 className="font-cinzel text-[11px] uppercase tracking-[0.3em] text-[#f5f0e8]">Recent Orders</h2>
          <Link href="/admin/orders" className="font-cinzel text-[9px] uppercase tracking-[0.3em] text-[#6e6358] hover:text-[#c9a84c] transition-colors">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-cinzel text-[13px] text-[#6e6358] uppercase tracking-widest">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-6 py-4 font-cinzel text-[9px] uppercase tracking-[0.3em] text-[#6e6358]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order.id} className={`border-b border-[rgba(245,240,232,0.05)] hover:bg-[rgba(201,168,76,0.02)] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                    <td className="px-6 py-4 font-mono text-[11px] text-[#6e6358]">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <p className="font-cinzel text-[11px] text-[#f5f0e8] uppercase tracking-wide">{order.customerName}</p>
                      <p className="font-inter text-[10px] text-[#6e6358] mt-0.5">{order.email}</p>
                    </td>
                    <td className="px-6 py-4 font-cinzel text-[13px] text-[#c9a84c] font-black">${order.total?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-cinzel text-[9px] uppercase tracking-[0.2em] px-3 py-1 ${statusColors[order.status] || 'text-gray-500'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-inter text-[11px] text-[#6e6358]">
                      {(order.createdAt as any)?.toDate?.()?.toLocaleDateString() || (order.createdAt as any)?.toLocaleDateString() || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
