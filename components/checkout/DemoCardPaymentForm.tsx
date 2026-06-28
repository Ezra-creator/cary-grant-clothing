'use client'
import { useState } from 'react'
import { Loader, Lock, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

interface DemoCardPaymentFormProps {
  amount: number
  onSuccess: (reference: string) => void
}

export default function DemoCardPaymentForm({
  amount, onSuccess,
}: DemoCardPaymentFormProps) {
  const [processing, setProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    
    // Simulate a realistic processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate a fake but realistic-looking reference ID
    const reference = `demo_${Date.now()}_${Math.random()
      .toString(36).substring(7)}`
    
    setProcessing(false)
    onSuccess(reference)
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16)
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-cgc-ink/10 p-5 
        bg-cgc-bone space-y-4">
        <div>
          <label className="font-inter text-xs  
             text-cgc-slate block mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Smith"
            className="w-full bg-cgc-ink border 
              border-white/10 focus:border-cgc-gold 
              outline-none px-4 py-3 text-cgc-paper 
              font-inter text-sm transition-colors"
          />
        </div>

        <div>
          <label className="font-inter text-xs  
             text-cgc-slate block mb-2">
            Card Number
          </label>
          <input
            type="text"
            required
            value={cardNumber}
            onChange={e => setCardNumber(
              formatCardNumber(e.target.value)
            )}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="w-full bg-cgc-ink border 
              border-white/10 focus:border-cgc-gold 
              outline-none px-4 py-3 text-cgc-paper 
              font-inter text-sm transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-inter text-xs  
               text-cgc-slate block mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              required
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full bg-cgc-ink border 
                border-white/10 focus:border-cgc-gold 
                outline-none px-4 py-3 text-cgc-paper 
                font-inter text-sm transition-colors"
            />
          </div>
          <div>
            <label className="font-inter text-xs  
               text-cgc-slate block mb-2">
              CVV
            </label>
            <input
              type="text"
              required
              value={cvv}
              onChange={e => setCvv(e.target.value)}
              placeholder="123"
              maxLength={3}
              className="w-full bg-cgc-ink border 
                border-white/10 focus:border-cgc-gold 
                outline-none px-4 py-3 text-cgc-paper 
                font-inter text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 
        text-cgc-slate">
        <ShieldCheck size={14} className="text-[var(--cgc-red)]" />
        <span className="font-inter text-xs  
          ">
          256-bit Encrypted Card Payment
        </span>
      </div>

      <motion.button
        type="submit"
        disabled={processing}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full flex items-center 
          justify-center gap-3 h-14 text-sm 
          disabled:opacity-40">
        {processing ? (
          <>
            <Loader size={16} className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock size={14} />
            Pay ${amount.toFixed(2)} CAD Securely
          </>
        )}
      </motion.button>

      <div className="flex items-center justify-center gap-3 
        pt-2">
        {['VISA', 'MASTERCARD', 'AMEX'].map(card => (
          <span key={card} className="font-inter text-xs 
            text-cgc-slate border border-cgc-hairline 
            px-2 py-1 ">
            {card}
          </span>
        ))}
      </div>
    </form>
  )
}
