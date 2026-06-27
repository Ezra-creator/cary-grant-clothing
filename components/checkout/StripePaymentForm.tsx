'use client'
import { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js'
import { Loader, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
  amount: number
}

export default function StripePaymentForm({
  onSuccess,
  onError,
  amount,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
        toast.error(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id)
        toast.success('Payment successful!')
      }
    } catch (err: any) {
      onError(err.message)
      toast.error('Something went wrong')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element */}
      <div className="bg-cgc-surface border border-cgc-gold-border 
        rounded-sm p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 
        text-cgc-gray-2">
        <Lock size={12} />
        <span className="font-cinzel text-xs uppercase 
          tracking-widest">
          Secured by Stripe — 256-bit SSL
        </span>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full flex items-center 
          justify-center gap-3 h-14 disabled:opacity-50 
          disabled:cursor-not-allowed text-sm">
        {processing ? (
          <>
            <Loader size={16} className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock size={14} />
            Pay ${amount.toFixed(2)} CAD
          </>
        )}
      </button>

      {/* Accepted Cards */}
      <div className="flex items-center justify-center gap-3">
        {['VISA', 'MC', 'AMEX', 'DISCOVER'].map(card => (
          <span
            key={card}
            className="font-cinzel text-xs text-cgc-gray-2 
              border border-cgc-gray-3 px-2 py-1 tracking-widest">
            {card}
          </span>
        ))}
      </div>
    </form>
  )
}
