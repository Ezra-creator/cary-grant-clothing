'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthContext } from '@/context/AuthContext'
import { updateProfile as updateFirebaseProfile, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Image from 'next/image'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?returnTo=/account')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '')
    }
  }, [user])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerEmail', '==', user.email),
          orderBy('createdAt', 'desc'),
          limit(10)
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

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateFirebaseProfile(user, { displayName })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user?.email) return
    try {
      await sendPasswordResetEmail(auth, user.email)
      toast.success('Password reset email sent!')
    } catch (error) {
      toast.error('Failed to send reset email')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cgc-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image src="/images/logo.jpg" alt="CGC" width={48} height={48} className="animate-pulse object-contain" />
          <p className="font-cinzel text-[#6e6358] uppercase tracking-[0.3em] text-[10px]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-cgc-black py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#161616] flex items-center justify-center overflow-hidden border border-[rgba(201,168,76,0.1)]">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
            ) : (
              <span className="font-cinzel text-2xl text-[#f5f0e8] uppercase">
                {user.displayName?.slice(0, 2) || user.email?.slice(0, 2) || 'U'}
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <h1 className="font-cinzel text-2xl text-[#f5f0e8] uppercase tracking-widest mb-2">
              {user.displayName || 'Customer'}
            </h1>
            <p className="font-inter text-[#6e6358]">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-[#161616] border border-[rgba(201,168,76,0.15)] p-8">
            <h2 className="font-cinzel text-lg text-[#f5f0e8] uppercase tracking-widest mb-6">PROFILE</h2>
            
            <div className="space-y-4">
              <div>
                <label className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#6e6358] block mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[rgba(245,240,232,0.1)] focus:border-[#c9a84c] outline-none px-4 py-3 text-[#f5f0e8] font-inter transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 border border-[rgba(245,240,232,0.1)] text-[#f5f0e8] font-cinzel text-[10px] uppercase tracking-[0.2em] py-3 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                >
                  CHANGE PASSWORD
                </button>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-[#161616] border border-[rgba(201,168,76,0.15)] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-cinzel text-lg text-[#f5f0e8] uppercase tracking-widest">MY ORDERS</h2>
              <Link
                href="/account/orders"
                className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] hover:underline"
              >
                VIEW ALL
              </Link>
            </div>

            {loadingOrders ? (
              <p className="font-inter text-[#6e6358] text-sm">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-inter text-[#6e6358] mb-4">No orders yet. Start shopping!</p>
                <Link
                  href="/shop"
                  className="btn-primary inline-block"
                >
                  SHOP NOW
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="border border-[rgba(245,240,232,0.05)] p-4 hover:border-[rgba(245,240,232,0.1)] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#6e6358]">
                        {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </p>
                      <span className={`font-cinzel text-[9px] uppercase tracking-[0.2em] px-2 py-1 ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <p className="font-inter text-[#f5f0e8] font-bold">${order.total || '0.00'}</p>
                    <p className="font-inter text-[#6e6358] text-sm">{order.items?.length || 0} items</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
