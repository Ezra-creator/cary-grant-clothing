'use client'
import { useState } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'

interface PayPalPaymentFormProps {
  amount: number
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
  orderData: {
    customerName: string
    email: string
    items: any[]
  }
}

export default function PayPalPaymentForm({
  amount,
  onSuccess,
  onError,
  orderData,
}: PayPalPaymentFormProps) {
  const [{ isPending }] = usePayPalScriptReducer()
  const [processing, setProcessing] = useState(false)

  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'CAD',
          description: `Cary Grant Clothing — Order for ${orderData.customerName}`,
          items: orderData.items,
        }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      return data.orderId
    } catch (err: any) {
      toast.error('Failed to create PayPal order')
      throw err
    }
  }

  const onApprove = async (data: any) => {
    setProcessing(true)
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderID }),
      })
      const captureData = await response.json()
      if (captureData.error) throw new Error(captureData.error)
      onSuccess(data.orderID)
      toast.success('Payment successful!')
    } catch (err: any) {
      onError(err.message)
      toast.error('Payment capture failed')
    } finally {
      setProcessing(false)
    }
  }

  if (isPending || processing) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader size={24} className="animate-spin text-cgc-gold" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="font-cinzel text-xs text-cgc-gray-1 uppercase tracking-widest text-center">
        You will be redirected to PayPal to complete payment
      </p>

      <div className="bg-cgc-surface border border-cgc-gold-border p-4 rounded-sm">
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay',
            height: 48,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            onError('PayPal error occurred')
            toast.error('PayPal payment failed')
          }}
          onCancel={() => {
            toast.error('Payment cancelled')
          }}
        />
      </div>

      <p className="text-cgc-gray-2 text-xs font-inter text-center">
        Total: <span className="text-cgc-gold font-bold">${amount.toFixed(2)} CAD</span>
      </p>
    </div>
  )
}
