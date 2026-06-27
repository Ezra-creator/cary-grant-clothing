import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/firebase'
import {
  collection, query, where, getDocs, updateDoc
} from 'firebase/firestore'

export async function POST(request: NextRequest) {
  const processor = new Stripe(process.env.PAYMENT_SECRET_KEY!, {
    apiVersion: '2026-05-27.dahlia',
  })
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = processor.webhooks.constructEvent(
      body, sig, process.env.PAYMENT_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Invalid signature' }, { status: 400 }
    )
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent
    const orderId = intent.metadata.orderId
    if (orderId) {
      const q = query(
        collection(db, 'orders'), where('__name__', '==', orderId)
      )
      const snap = await getDocs(q)
      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, {
          paymentStatus: 'paid',
          status: 'processing',
          paymentReference: intent.id,
        })
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent
    const orderId = intent.metadata.orderId
    if (orderId) {
      const q = query(
        collection(db, 'orders'), where('__name__', '==', orderId)
      )
      const snap = await getDocs(q)
      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, {
          paymentStatus: 'failed',
          status: 'cancelled',
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
