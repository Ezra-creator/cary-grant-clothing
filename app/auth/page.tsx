'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { signUpWithEmail, loginWithEmail, resetPassword } from '@/lib/auth'

function AuthContent() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/account'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Signup form state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [signupTerms, setSignupTerms] = useState(false)
  const [signupError, setSignupError] = useState('')

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return Math.min(strength, 4)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    try {
      const user = await loginWithEmail(loginEmail, loginPassword)
      toast.success(`Welcome back, ${user.displayName || 'back'}!`)
      router.push(returnTo)
    } catch (err: any) {
      const errorCode = err.code
      let errorMessage = 'An error occurred'
      
      switch (errorCode) {
        case 'auth/user-not-found':
          errorMessage = 'No account with this email'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          break
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password'
          break
        default:
          errorMessage = err.message || 'An error occurred'
      }
      
      setLoginError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError('')

    if (!signupName.trim()) {
      setSignupError('Please enter your name')
      return
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match')
      return
    }
    if (!signupTerms) {
      setSignupError('Please agree to the Terms & Privacy Policy')
      return
    }

    setLoading(true)

    try {
      const user = await signUpWithEmail(signupEmail, signupPassword, signupName)
      toast.success(`Welcome to CGC, ${user.displayName || ''}!`)
      router.push(returnTo)
    } catch (err: any) {
      const errorCode = err.code
      let errorMessage = 'An error occurred'
      
      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered'
          break
        case 'auth/weak-password':
          errorMessage = 'Password must be at least 6 characters'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          break
        default:
          errorMessage = err.message || 'An error occurred'
      }
      
      setSignupError(errorMessage)
    } finally {
      setLoading(false)
    }
  }



  const handleForgotPassword = async () => {
    if (!loginEmail) {
      setLoginError('Please enter your email address')
      return
    }
    setLoading(true)
    try {
      await resetPassword(loginEmail)
      toast.success('Password reset email sent!')
    } catch (err: any) {
      setLoginError('Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-[480px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/images/logo.jpg" alt="CGC" width={60} height={60} className="object-contain" />
        </div>

        {/* Card */}
        <div className="bg-[#161616] border border-[rgba(201,168,76,0.15)] p-8 relative">
          {/* Top gold accent border */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#c9a84c]" />
          {/* Tab Switcher */}
          <div className="flex gap-8 mb-8 relative">
            <button
              onClick={() => { setIsLogin(true); setLoginError(''); setSignupError('') }}
              className={`font-cinzel text-[11px] uppercase tracking-[0.3em] pb-2 transition-colors ${
                isLogin ? 'text-[#c9a84c]' : 'text-[#6e6358]'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => { setIsLogin(false); setLoginError(''); setSignupError('') }}
              className={`font-cinzel text-[11px] uppercase tracking-[0.3em] pb-2 transition-colors ${
                !isLogin ? 'text-[#c9a84c]' : 'text-[#6e6358]'
              }`}
            >
              CREATE ACCOUNT
            </button>
            {/* Active underline */}
            <motion.div
              layout
              className="absolute bottom-0 h-[2px] bg-[#c9a84c]"
              initial={false}
              animate={{ left: isLogin ? '0%' : '50%', width: '50%' }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#a09888] block mb-2">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-[#161616] border border-[rgba(245,240,232,0.1)] focus:border-[#c9a84c] outline-none px-4 py-3 text-[#f5f0e8] font-inter placeholder-[#6e6358] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#a09888] block mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#161616] border border-[rgba(245,240,232,0.1)] focus:border-[#c9a84c] outline-none px-4 py-3 text-[#f5f0e8] font-inter placeholder-[#6e6358] transition-colors pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e6358] hover:text-[#f5f0e8] transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#ef4444] font-inter text-[11px]"
                    >
                      {loginError}
                    </motion.p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="font-cinzel text-[9px] uppercase tracking-[0.2em] text-[#c9a84c] hover:underline"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                  </button>
                </form>



                <p className="text-center mt-6 text-[#6e6358] font-inter text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#f5f0e8] hover:text-[#c9a84c] transition-colors font-cinzel text-[10px] uppercase tracking-[0.2em]"
                  >
                    CREATE ONE
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#a09888] block mb-2">Full Name</label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full bg-[#161616] border border-[rgba(245,240,232,0.1)] focus:border-[#c9a84c] outline-none px-4 py-3 text-[#f5f0e8] font-inter placeholder-[#6e6358] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#a09888] block mb-2">Email</label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-[#161616] border border-[rgba(245,240,232,0.1)] focus:border-[#c9a84c] outline-none px-4 py-3 text-[#f5f0e8] font-inter placeholder-[#6e6358] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#a09888] block mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#161616] border border-[rgba(245,240,232,0.1)] focus:border-[#c9a84c] outline-none px-4 py-3 text-[#f5f0e8] font-inter placeholder-[#6e6358] transition-colors pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e6358] hover:text-[#f5f0e8] transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {/* Password strength indicator */}
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 transition-colors ${
                            i <= getPasswordStrength(signupPassword)
                              ? getPasswordStrength(signupPassword) === 4
                                ? 'bg-green-500'
                                : 'bg-[#c9a84c]'
                              : 'bg-white/[0.1]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#a09888] block mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupConfirmPassword}
                        onChange={e => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#161616] border border-[rgba(245,240,232,0.1)] focus:border-[#c9a84c] outline-none px-4 py-3 text-[#f5f0e8] font-inter placeholder-[#6e6358] transition-colors pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e6358] hover:text-[#f5f0e8] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {signupError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#ef4444] font-inter text-[11px]"
                    >
                      {signupError}
                    </motion.p>
                  )}

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={signupTerms}
                      onChange={e => setSignupTerms(e.target.checked)}
                      required
                      className="mt-1 accent-[#c9a84c]"
                    />
                    <label htmlFor="terms" className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#6e6358]">
                      I agree to the Terms & Privacy Policy
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                  </button>
                </form>



                <p className="text-center mt-6 text-[#6e6358] font-inter text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-[#f5f0e8] hover:text-[#c9a84c] transition-colors font-cinzel text-[10px] uppercase tracking-[0.2em]"
                  >
                    SIGN IN
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>}>
      <AuthContent />
    </Suspense>
  )
}
