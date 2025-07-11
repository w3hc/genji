import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
})

// Note: The webhook will be called by Stripe when certain events occur
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ message: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session

      // Extract the wallet address from metadata
      const walletAddress = session.metadata?.walletAddress

      if (walletAddress) {
        // Here you would typically:
        // 1. Update your database to mark this user as a subscriber
        // 2. Enable premium features for this wallet
        console.log(`Subscription started for wallet: ${walletAddress}`)
      }
      break

    case 'customer.subscription.updated':
      // Handle subscription updates
      break

    case 'customer.subscription.deleted':
      // Handle subscription cancellations
      break

    default:
      // Unexpected event type
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
