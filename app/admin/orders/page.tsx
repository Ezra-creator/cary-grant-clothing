'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore'
import { Order } from '@/types'
import { Eye, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColors: Record<string, string> = {
  pending: 'bg-amber-900/30 text-amber-400 border border-amber-800/50',
  processing: 'bg-blue-900/30 text-blue-400 border border-blue-800/50',
  shipped: 'bg-purple-900/30 text-purple-400 border border-purple-800/50',
  delivered: 'bg-green-900/30 text-green-400 border border-green-800/50',
  cancelled: 'bg-red-900/30 text-red-400 border border-red-800/50',
}

const orderProgress = ['pending', 'processing', 'shipped', 'delivered']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status })
      toast.success('Order status updated!')
      fetchOrders()
      if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status: status as Order['status'] } : null)
    } catch {
      toast.error('Failed to update status')
    }
  }

  // Pill stats
  const pillStats = ['all', ...statuses].map(s => ({
    label: s === 'all' ? 'All Orders' : s,
    count: s === 'all' ? orders.length : orders.filter(o => o.status === s).length,
  }))

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus)

  const progressIdx = selected ? orderProgress.indexOf(selected.status) : -1

  return (
    <div>
      <div className="mb-8">
        <p className="font-inter text-[10px] tracking-[0.5em] text-cgc-red mb-2">Management</p>
        <h1 className="font-inter text-[28px] text-cgc-paper">Orders</h1>
      </div>

      {/* Pill Stats Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {pillStats.map(({ label, count }) => (
          <button
            key={label}
            onClick={() => setFilterStatus(label === 'All Orders' ? 'all' : label)}
            className={`font-inter text-[9px] tracking-[0.3em] px-4 py-2 flex items-center gap-2 transition-all duration-200 ${
              (label === 'All Orders' ? 'all' : label) === filterStatus
                ? 'bg-cgc-red border border-cgc-red text-white'
                : 'border border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
            }`}
          >
            {label}
            <span className="bg-black/30 px-1.5 py-0.5 rounded text-[8px]">{count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-cgc-ink animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-cgc-ink border border-white/5 p-16 text-center">
          <p className="font-inter text-gray-600 text-[13px]">No orders found</p>
        </div>
      ) : (
        <div className="bg-cgc-ink border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Update', 'View'].map(h => (
                    <th key={h} className="text-left px-5 py-4 font-inter text-[9px] tracking-[0.3em] text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order.id} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                    <td className="px-5 py-4 font-mono text-[11px] text-gray-600">#{order.id.slice(0, 8)}</td>
                    <td className="px-5 py-4">
                      <p className="font-inter text-[11px] text-white">{order.customerName}</p>
                      <p className="font-inter text-[10px] text-gray-600 mt-0.5">{order.email}</p>
                    </td>
                    <td className="px-5 py-4 font-inter text-[13px] text-cgc-red font-black">${order.total?.toFixed(2)}</td>
                    <td className="px-5 py-4 flex items-center gap-2">
                      <span className={`font-inter text-[9px] tracking-[0.2em] px-2 py-1 ${
                        order.paymentStatus === 'paid' ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-red-900/30 text-red-400 border border-red-800/50'
                      }`}>
                        {order.paymentStatus}
                      </span>
                      {(order as any).isDemoOrder && (
                        <span className="font-inter text-[8px] tracking-[0.2em] px-2 py-1 bg-amber-900/30 text-amber-400 border border-amber-800/50">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-inter text-[9px] tracking-[0.2em] px-2 py-1 ${statusColors[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="bg-cgc-ink border border-white/10 text-gray-400 font-inter text-[9px] tracking-[0.2em] px-2 py-2 outline-none focus:border-cgc-red transition-colors cursor-pointer"
                      >
                        {statuses.map(s => <option key={s} value={s} className="bg-cgc-ink">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(order)}
                        className="w-8 h-8 bg-white/5 hover:bg-cgc-red/20 flex items-center justify-center text-gray-500 hover:text-cgc-red transition-all"
                        aria-label="View order"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-cgc-ink border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                  <div>
                    <p className="font-inter text-[9px] tracking-[0.4em] text-cgc-red mb-1">Order Details</p>
                    <h2 className="font-inter text-[14px] text-cgc-paper">#{selected.id.slice(0, 8)}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Progress Stepper */}
                  {progressIdx !== -1 && (
                    <div>
                      <p className="font-inter text-[9px] tracking-[0.4em] text-gray-500 mb-4">Order Progress</p>
                      <div className="flex items-center">
                        {orderProgress.map((s, i) => (
                          <div key={s} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-inter transition-all ${
                                i < progressIdx ? 'bg-green-700 text-white' :
                                i === progressIdx ? 'bg-cgc-red text-white' :
                                'bg-white/5 border border-white/15 text-gray-600'
                              }`}>
                                {i < progressIdx ? <Check size={12} /> : i + 1}
                              </div>
                              <span className={`font-inter text-[8px] tracking-[0.2em] ${i <= progressIdx ? 'text-white' : 'text-gray-700'}`}>{s}</span>
                            </div>
                            {i < orderProgress.length - 1 && (
                              <div className={`flex-1 h-[1px] mx-1 mb-5 ${i < progressIdx ? 'bg-green-700' : 'bg-white/10'}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Customer', value: selected.customerName },
                      { label: 'Email', value: selected.email },
                      { label: 'Phone', value: selected.phone },
                      { label: 'Address', value: `${selected.address}, ${selected.city}, ${selected.province}` },
                      { label: 'Payment Method', value: selected.paymentMethod },
                      { label: 'Payment Status', value: selected.paymentStatus },
                    ].map(({ label, value }) => (
                      <div key={label} className={label === 'Address' ? 'col-span-2' : ''}>
                        <p className="font-inter text-[9px] tracking-[0.3em] text-gray-600 mb-1">{label}</p>
                        <p className="font-inter text-[13px] text-white capitalize">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Items */}
                  <div className="border-t border-white/5 pt-4">
                    <p className="font-inter text-[9px] tracking-[0.4em] text-gray-500 mb-4">Items</p>
                    <div className="space-y-3">
                      {selected.items?.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                          <div>
                            <p className="font-inter text-[11px] text-white">{item.product?.name}</p>
                            <p className="font-inter text-[10px] text-gray-500 mt-0.5">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                          </div>
                          <p className="font-inter text-cgc-red font-black">${(item.product?.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    {[
                      { label: 'Subtotal', value: `$${selected.subtotal?.toFixed(2)}` },
                      { label: 'Shipping', value: selected.shipping === 0 ? 'Free' : `$${selected.shipping?.toFixed(2)}` },
                      { label: 'Tax (HST 13%)', value: `$${selected.tax?.toFixed(2)}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between font-inter text-[10px] tracking-[0.2em] text-gray-500">
                        <span>{label}</span><span className="text-white">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-inter tracking-[0.2em] border-t border-white/10 pt-3">
                      <span className="text-[11px] text-white">Total</span>
                      <span className="text-cgc-red font-black text-[16px]">${selected.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="border-t border-white/5 pt-4">
                    <p className="font-inter text-[9px] tracking-[0.4em] text-gray-500 mb-3">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selected.id, s)}
                          className={`font-inter text-[9px] tracking-[0.2em] px-3 py-2 border transition-all ${
                            selected.status === s
                              ? 'bg-cgc-red border-cgc-red text-white'
                              : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
