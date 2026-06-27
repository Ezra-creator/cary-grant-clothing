'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuthContext } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Check, CreditCard, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import DemoCardPaymentForm from '@/components/checkout/DemoCardPaymentForm'
import PayPalPaymentForm from '@/components/checkout/PayPalPaymentForm'

type Step = 'shipping' | 'payment' | 'review' | 'success'

const emptyShipping = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', province: '', postalCode: '', country: 'Canada',
}

const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
]

function FloatingInput({ label, type = 'text', value, onChange, required = false }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="relative">
      <label className={`absolute left-0 transition-all duration-200 font-cinzel uppercase pointer-events-none ${
        focused || value
          ? 'top-0 text-[9px] tracking-[0.4em] text-[#c9a84c]'
          : 'top-4 text-[11px] tracking-[0.2em] text-[#6e6358]'
      }`}>{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-6 pb-2 bg-transparent border-b border-[rgba(245,240,232,0.2)] focus:border-[#c9a84c] outline-none font-inter text-[14px] text-[#f5f0e8] transition-colors"
      />
    </div>
  )
}



function CheckoutContent() {
  const { user } = useAuthContext()
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const [step, setStep] = useState<Step>('shipping')
  const [shipping, setShipping] = useState(emptyShipping)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null)

  const [processing, setProcessing] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const subtotal = total()
  const shippingCost = subtotal >= 150 ? 0 : 15
  const tax = subtotal * 0.13
  const orderTotal = subtotal + shippingCost + tax

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setShipping(prev => ({ ...prev, email: user.email || '' }))
    }
  }, [user])

  const saveOrder = async (paymentMethod: 'card' | 'paypal', paymentId: string) => {
    const orderData = {
      customerName: `${shipping.firstName} ${shipping.lastName}`,
      email: shipping.email,
      phone: shipping.phone,
      address: shipping.address,
      city: shipping.city,
      province: shipping.province,
      postalCode: shipping.postalCode,
      country: shipping.country,
      items: items.map(i => ({
        product: {
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          images: i.product.images,
        },
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      })),
      subtotal,
      shipping: shippingCost,
      tax,
      total: orderTotal,
      paymentMethod,
      paymentId,
      paymentStatus: 'paid',
      status: 'pending',
      isDemoOrder: true,
      createdAt: serverTimestamp(),
    }
    const docRef = await addDoc(collection(db, 'orders'), orderData)
    
    // Send order confirmation email
    try {
      await fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: { ...orderData, id: docRef.id } }),
      })
    } catch (err) {
      console.error('Failed to send confirmation email:', err)
    }
    
    return docRef.id
  }



  const handleCardPaymentSuccess = async (paymentReference: string) => {
    setProcessing(true)
    try {
      const savedOrderId = await saveOrder('card', paymentReference)
      setOrderId(savedOrderId)
      clearCart()
      setStep('success')
      toast.success('Payment successful!')
    } catch (err) {
      toast.error('Failed to save order')
    } finally {
      setProcessing(false)
    }
  }

  const handlePayPalSuccess = async (paypalOrderId: string) => {
    setProcessing(true)
    try {
      const savedOrderId = await saveOrder('paypal', paypalOrderId)
      setOrderId(savedOrderId)
      clearCart()
      setStep('success')
      toast.success('Payment successful!')
    } catch (err) {
      toast.error('Failed to save order')
    } finally {
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cgc-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-[#6e6358] uppercase tracking-widest mb-6">Your cart is empty</p>
          <Link href="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    )
  }

  // Auth prompt for non-logged-in users
  if (!user && showAuthPrompt) {
    return (
      <div className="min-h-screen bg-cgc-black pt-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#161616] border border-[rgba(201,168,76,0.15)] p-8 text-center">
          <h2 className="font-cinzel text-xl text-[#f5f0e8] uppercase tracking-widest mb-4">
            Sign in for a faster checkout
          </h2>
          <p className="font-inter text-[#6e6358] mb-8">
            Sign in to access your saved information and track your orders.
          </p>
          <div className="flex gap-4">
            <Link
              href="/auth?returnTo=/checkout"
              className="btn-primary flex-1"
            >
              SIGN IN
            </Link>
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="btn-secondary flex-1"
            >
              CONTINUE AS GUEST
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-cgc-black pt-20 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-[#c9a84c]/10 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center max-w-lg"
        >
          {/* Animated Checkmark */}
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <motion.circle
                cx="50" cy="50" r="45"
                stroke="#c9a84c"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <motion.path
                d="M30 50 L45 65 L70 35"
                stroke="#c9a84c"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
              />
            </svg>
          </div>
          <h1 className="font-cinzel text-[40px] text-[#f5f0e8] uppercase tracking-wide mb-4">Order Confirmed!</h1>
          <div className="w-[60px] h-[2px] bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-[#6e6358] font-inter mb-2">Thank you, <span className="text-[#f5f0e8]">{shipping.firstName}</span>!</p>
          <p className="text-[#6e6358] font-inter text-[13px] mb-4">Your order has been placed successfully.</p>
          
          {orderId && (
            <p className="font-cinzel text-[#c9a84c] text-sm uppercase tracking-widest mb-6">
              Order ID: {orderId}
            </p>
          )}
          
          <div className="bg-[#161616] border border-[rgba(201,168,76,0.15)] p-6 mb-8">
            <p className="font-inter text-[#6e6358] text-sm mb-2">
              Your order will be processed within 24 hours.
            </p>
            <p className="font-inter text-[#6e6358] text-sm">
              Estimated delivery: 5-7 business days
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
            {user && <Link href="/account" className="btn-secondary">View My Orders</Link>}
          </div>
        </motion.div>
      </div>
    )
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ]
  const currentStepIdx = steps.findIndex(s => s.key === step)

  return (
    <div className="min-h-screen bg-cgc-black pt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <Link href="/cart" className="flex items-center gap-2 text-[#6e6358] hover:text-[#f5f0e8] font-cinzel text-[10px] uppercase tracking-[0.3em] mb-10 transition-colors">
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-14">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{
                    backgroundColor: currentStepIdx > i ? '#22c55e' : step === s.key ? '#c9a84c' : 'transparent',
                    borderColor: currentStepIdx > i ? '#22c55e' : step === s.key ? '#c9a84c' : 'rgba(255,255,255,0.15)',
                  }}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-cinzel text-[12px] text-white"
                >
                  {currentStepIdx > i ? <Check size={14} /> : i + 1}
                </motion.div>
                <span className={`font-cinzel text-[9px] uppercase tracking-[0.3em] ${step === s.key ? 'text-[#f5f0e8]' : 'text-[#6e6358]'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-[80px] md:w-[120px] h-[1px] bg-white/10 mb-5 mx-2" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* SHIPPING STEP */}
              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-cinzel text-[18px] text-[#f5f0e8] uppercase tracking-[0.2em] mb-8">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <FloatingInput label="First Name" value={shipping.firstName} onChange={v => setShipping({ ...shipping, firstName: v })} required />
                    <FloatingInput label="Last Name" value={shipping.lastName} onChange={v => setShipping({ ...shipping, lastName: v })} required />
                    <FloatingInput label="Email Address" type="email" value={shipping.email} onChange={v => setShipping({ ...shipping, email: v })} required />
                    <FloatingInput label="Phone Number" type="tel" value={shipping.phone} onChange={v => setShipping({ ...shipping, phone: v })} />
                    <div className="sm:col-span-2">
                      <FloatingInput label="Street Address" value={shipping.address} onChange={v => setShipping({ ...shipping, address: v })} required />
                    </div>
                    <FloatingInput label="City" value={shipping.city} onChange={v => setShipping({ ...shipping, city: v })} required />
                    <FloatingInput label="Postal Code" value={shipping.postalCode} onChange={v => setShipping({ ...shipping, postalCode: v })} required />
                    <div className="sm:col-span-2 relative">
                      <label className="block font-cinzel text-[9px] uppercase tracking-[0.4em] text-[#c9a84c] mb-3">Province</label>
                      <select
                        value={shipping.province}
                        onChange={e => setShipping({ ...shipping, province: e.target.value })}
                        className="w-full pb-2 bg-transparent border-b border-[rgba(245,240,232,0.2)] focus:border-[#c9a84c] outline-none font-inter text-[14px] text-[#f5f0e8] appearance-none cursor-pointer transition-colors"
                      >
                        <option value="" className="bg-[#111]">Select Province</option>
                        {provinces.map(p => <option key={p} value={p} className="bg-[#111]">{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!shipping.firstName || !shipping.email || !shipping.address || !shipping.city || !shipping.province)
                        return toast.error('Please fill in all required fields')
                      setStep('payment')
                    }}
                    className="btn-primary mt-10 w-full"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* PAYMENT STEP */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-cinzel text-[18px] text-[#f5f0e8] uppercase tracking-[0.2em] mb-8">Payment Method</h2>

                  {error && (
                    <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 mb-6 font-inter text-sm">
                      {error}
                    </div>
                  )}

                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Card Payment */}
                    <button
                      onClick={() => {
                        setPaymentMethod('card')
                      }}
                      className={`p-6 border-2 transition-all duration-200 text-left ${
                        paymentMethod === 'card'
                          ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                          : 'border-[rgba(245,240,232,0.1)] hover:border-[rgba(245,240,232,0.3)]'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <CreditCard size={32} className={paymentMethod === 'card' ? 'text-[#c9a84c]' : 'text-[#6e6358]'} />
                        <div>
                          <p className="font-cinzel text-[13px] uppercase tracking-[0.2em] text-[#f5f0e8]">Credit / Debit Card</p>
                          <p className="font-inter text-[11px] text-[#6e6358] mt-1">Visa, Mastercard, Amex, Discover</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {['VISA', 'MC', 'AMEX'].map(card => (
                          <span key={card} className="font-cinzel text-[10px] text-[#6e6358] border border-[rgba(245,240,232,0.2)] px-2 py-1 tracking-widest">
                            {card}
                          </span>
                        ))}
                      </div>
                    </button>

                    {/* PayPal */}
                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-6 border-2 transition-all duration-200 text-left ${
                        paymentMethod === 'paypal'
                          ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                          : 'border-[rgba(245,240,232,0.1)] hover:border-[rgba(245,240,232,0.3)]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#ffc439] rounded flex items-center justify-center">
                          <span className="font-bold text-[#003087] text-xs">P</span>
                        </div>
                        <div>
                          <p className="font-cinzel text-[13px] uppercase tracking-[0.2em] text-[#f5f0e8]">PayPal</p>
                          <p className="font-inter text-[11px] text-[#6e6358] mt-1">Pay with your PayPal account</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Payment Forms */}
                  {paymentMethod === 'card' && (
                    <div className="mb-8">
                      <DemoCardPaymentForm
                        amount={orderTotal}
                        onSuccess={handleCardPaymentSuccess}
                      />
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="mb-8">
                      <PayPalPaymentForm
                        amount={orderTotal}
                        onSuccess={handlePayPalSuccess}
                        onError={(err) => setError(err)}
                        orderData={{
                          customerName: `${shipping.firstName} ${shipping.lastName}`,
                          email: shipping.email,
                          items: items,
                        }}
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button onClick={() => setStep('shipping')} className="btn-secondary flex-1">
                      Back
                    </button>
                    {paymentMethod && (
                      <button onClick={() => setStep('review')} className="btn-primary flex-1">
                        Review Order
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* REVIEW STEP */}
              {step === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-cinzel text-[18px] text-[#f5f0e8] uppercase tracking-[0.2em] mb-8">Review Your Order</h2>

                  <div className="space-y-4 mb-8">
                    {items.map((item, i) => (
                      <div key={i} className="flex gap-4 py-4 border-b border-[rgba(245,240,232,0.05)]">
                        <div className="w-16 h-16 bg-[#161616] flex-shrink-0">
                          {item.product.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-cinzel text-[11px] text-[#f5f0e8] uppercase tracking-[0.1em]">{item.product.name}</p>
                          <p className="font-inter text-[11px] text-[#6e6358] mt-1">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                          <p className="font-cinzel text-[#c9a84c] font-black mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary box */}
                  <div className="bg-[#161616] border border-[rgba(245,240,232,0.1)] p-5 mb-8 grid grid-cols-2 gap-3 text-[10px] font-cinzel uppercase tracking-[0.2em]">
                    <div className="text-[#6e6358]">Ship to:</div>
                    <div className="text-[#f5f0e8] text-right">{shipping.city}, {shipping.province}</div>
                    <div className="text-[#6e6358]">Payment:</div>
                    <div className="text-[#f5f0e8] text-right capitalize">{paymentMethod === 'card' ? 'Credit / Debit Card' : 'PayPal'}</div>
                    <div className="text-[#6e6358]">Total:</div>
                    <div className="text-[#c9a84c] text-right font-black text-[13px]">${orderTotal.toFixed(2)}</div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep('payment')} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button
                      onClick={() => setStep('payment')}
                      disabled={processing}
                      className="btn-primary flex-1"
                    >
                      {processing ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a0908] border border-[rgba(201,168,76,0.1)] p-6 sticky top-[100px]">
              <h3 className="font-cinzel text-[11px] uppercase tracking-[0.3em] text-[#f5f0e8] mb-6">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between font-inter text-[11px] text-[#6e6358]">
                    <span className="truncate flex-1 pr-2">{item.product.name} ×{item.quantity}</span>
                    <span className="text-[#f5f0e8] flex-shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[rgba(245,240,232,0.1)] pt-4 space-y-2">
                {[
                  { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                  { label: 'Shipping', value: shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}` },
                  { label: 'HST (13%)', value: `$${tax.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#6e6358]">
                    <span>{label}</span><span className="text-[#f5f0e8]">{value}</span>
                  </div>
                ))}
                {shippingCost === 0 && (
                  <div className="flex items-center gap-2 text-[#c9a84c] text-[10px] font-cinzel uppercase tracking-[0.2em]">
                    <Lock size={12} />
                    <span>Free shipping applied</span>
                  </div>
                )}
                <div className="flex justify-between font-cinzel uppercase tracking-[0.2em] border-t border-[rgba(245,240,232,0.1)] pt-3">
                  <span className="text-[11px] text-[#f5f0e8]">Total</span>
                  <span className="text-[#c9a84c] font-black text-[16px]">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-[rgba(245,240,232,0.1)]">
                <div className="flex items-center justify-center gap-2 text-[#6e6358]">
                  <Lock size={12} />
                  <span className="font-cinzel text-[10px] uppercase tracking-widest">Secure Checkout</span>
                </div>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className="w-10 h-5 bg-[#c9a84c]/20 rounded flex items-center justify-center">
                    <span className="font-bold text-[#c9a84c] text-[7px] tracking-wider">ENCRYPTED</span>
                  </div>
                  <div className="w-8 h-5 bg-[#c9a84c]/20 rounded flex items-center justify-center">
                    <span className="font-bold text-[#c9a84c] text-[8px]">PAYPAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: 'CAD',
        intent: 'capture',
      }}
    >
      <CheckoutContent />
    </PayPalScriptProvider>
  )
}
