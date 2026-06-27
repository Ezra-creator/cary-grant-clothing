import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const orderId = paymentIntent.metadata.orderId

    if (orderId) {
      try {
        const q = query(
          collection(db, 'orders'),
          where('__name__', '==', orderId)
        )
        const snap = await getDocs(q)
        if (!snap.empty) {
          await updateDoc(snap.docs[0].ref, {
            paymentStatus: 'paid',
            status: 'processing',
            stripePaymentIntentId: paymentIntent.id,
          })
        }
      } catch (err) {
        console.error('Firebase update error:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
