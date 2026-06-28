'use client'
import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      
      // Set admin session cookie (expires in 24 hours)
      document.cookie = `cgc-admin-token=${token}; path=/; max-age=86400; SameSite=Strict`
      
      toast.success('Welcome back!')
      router.push('/admin')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cgc-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Image src="/images/logo.jpg" alt="CGC" width={80} height={80} className="mx-auto mb-6 object-contain" />
          <h1 className="font-inter text-2xl text-cgc-paper mb-2">Admin Portal</h1>
          <p className="text-cgc-gray font-inter text-sm">Cary Grant Clothing — Management</p>
        </div>

        <div className="bg-cgc-ink border border-white/5 p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-inter text-xs text-cgc-gray block mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@carygrantclothing.com" required
                className="w-full bg-cgc-ink border border-white/10 focus:border-cgc-red outline-none px-4 py-3 text-cgc-paper font-inter placeholder-cgc-gray/30 transition-colors" />
            </div>
            <div>
              <label className="font-inter text-xs text-cgc-gray block mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full bg-cgc-ink border border-white/10 focus:border-cgc-red outline-none px-4 py-3 text-cgc-paper font-inter placeholder-cgc-gray/30 transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
