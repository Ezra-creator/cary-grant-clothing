'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrdersPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?returnTo=/account/orders')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerEmail', '==', user.email),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoadingOrders(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-cgc-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image src="/images/logo.jpg" alt="CGC" width={48} height={48} className="animate-pulse object-contain" />
          <p className="font-cinzel text-gray-500 uppercase tracking-[0.3em] text-[10px]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-cgc-black py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors inline-block mb-4"
          >
            ← BACK TO ACCOUNT
          </Link>
          <h1 className="font-cinzel text-2xl text-white uppercase tracking-widest">MY ORDERS</h1>
        </div>

        {loadingOrders ? (
          <p className="font-inter text-gray-500 text-sm">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-cgc-surface border border-white/[0.06] p-12 text-center">
            <p className="font-inter text-gray-500 mb-6">No orders yet. Start shopping!</p>
            <Link href="/shop" className="btn-primary inline-block">
              SHOP NOW
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-cgc-surface border border-white/[0.06] overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer hover:border-white/[0.1] transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                          ORDER #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="font-inter text-white font-bold text-lg">
                          ${order.total || '0.00'}
                        </p>
                      </div>
                      <div>
                        <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                          DATE
                        </p>
                        <p className="font-inter text-gray-300 text-sm">
                          {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                          STATUS
                        </p>
                        <span className={`font-cinzel text-[10px] uppercase tracking-[0.2em] px-3 py-1 ${
                          order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                    {expandedOrder === order.id ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/[0.06]"
                    >
                      <div className="p-6 space-y-6">
                        {/* Items */}
                        <div>
                          <h3 className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                            ITEMS
                          </h3>
                          <div className="space-y-4">
                            {order.items?.map((item: any, index: number) => (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-cgc-black overflow-hidden border border-white/[0.05]">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-cinzel text-sm text-white uppercase tracking-wider mb-1">
                                    {item.name}
                                  </p>
                                  <p className="font-inter text-gray-500 text-xs">
                                    {item.size} × {item.quantity}
                                  </p>
                                </div>
                                <p className="font-inter text-white font-bold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <h3 className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                            SHIPPING ADDRESS
                          </h3>
                          <div className="font-inter text-gray-300 text-sm space-y-1">
                            <p>{order.shippingAddress?.fullName || ''}</p>
                            <p>{order.shippingAddress?.address || ''}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode || ''}</p>
                            <p>{order.shippingAddress?.country || ''}</p>
                            <p>{order.shippingAddress?.phone || ''}</p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <h3 className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                            PAYMENT METHOD
                          </h3>
                          <p className="font-inter text-gray-300 text-sm">
                            {order.paymentMethod || 'Credit Card'}
                          </p>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t border-white/[0.06] pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-inter text-gray-500 text-sm">Subtotal</span>
                            <span className="font-inter text-white text-sm">${order.subtotal || '0.00'}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="font-inter text-gray-500 text-sm">Shipping</span>
                            <span className="font-inter text-white text-sm">${order.shipping || '0.00'}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span className="font-cinzel text-white text-sm uppercase tracking-wider">Total</span>
                            <span className="font-inter text-white text-lg">${order.total || '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
