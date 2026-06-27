import { loadStripe } from '@stripe/stripe-js'

let paymentProcessor: ReturnType<typeof loadStripe> | null = null

export const getPaymentProcessor = () => {
  if (!paymentProcessor) {
    paymentProcessor = loadStripe(
      process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY!
    )
  }
  return paymentProcessor
}
