import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const processor = new Stripe(process.env.PAYMENT_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, customerEmail, customerName, orderId } =
      await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const intent = await processor.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'cad',
      payment_method_types: ['card'],
      receipt_email: customerEmail,
      metadata: {
        orderId: orderId || '',
        customerName: customerName || '',
        store: 'Cary Grant Clothing',
      },
      description: `Cary Grant Clothing — Order for ${customerName}`,
    })

    return NextResponse.json({
      clientSecret: intent.client_secret,
      intentId: intent.id,
    })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment could not be initialized. Please try again.' },
      { status: 500 }
    )
  }
}
