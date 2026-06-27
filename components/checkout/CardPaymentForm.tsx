'use client'
import { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js'
import { Loader, Lock, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface CardPaymentFormProps {
  amount: number
  onSuccess: (reference: string) => void
  onError: (error: string) => void
}

export default function CardPaymentForm({
  amount, onSuccess, onError,
}: CardPaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setErrorMessage('')

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        const message = error.message || 'Card payment failed'
        setErrorMessage(message)
        onError(message)
        toast.error(message)
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id)
        toast.success('Payment successful!')
      }
    } catch (err: any) {
      setErrorMessage('Something went wrong. Please try again.')
      onError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-cgc-gold-border p-5 bg-cgc-surface">
        <PaymentElement
          options={{
            layout: { type: 'tabs', defaultCollapsed: false },
            paymentMethodOrder: ['card'],
          }}
        />
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-950/30 border border-red-500/30 p-4"
        >
          <p className="text-red-400 font-inter text-sm">{errorMessage}</p>
        </motion.div>
      )}

      <div className="flex items-center justify-center gap-2 text-cgc-gray-2">
        <ShieldCheck size={14} className="text-cgc-gold" />
        <span className="font-cinzel text-xs uppercase tracking-widest">
          256-bit Encrypted Card Payment
        </span>
      </div>

      <motion.button
        type="submit"
        disabled={!stripe || processing}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full flex items-center justify-center
          gap-3 h-14 text-sm disabled:opacity-40"
      >
        {processing ? (
          <><Loader size={16} className="animate-spin" /> Processing Payment...</>
        ) : (
          <><Lock size={14} /> Pay ${amount.toFixed(2)} CAD Securely</>
        )}
      </motion.button>

      <div className="flex items-center justify-center gap-3 pt-2">
        {['VISA', 'MASTERCARD', 'AMEX'].map(card => (
          <span key={card} className="font-cinzel text-xs text-cgc-gray-1
            border border-cgc-gray-3 px-2 py-1 tracking-widest">
            {card}
          </span>
        ))}
      </div>
    </form>
  )
}
