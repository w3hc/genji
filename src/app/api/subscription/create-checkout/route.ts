import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    // Validate wallet address
    if (!walletAddress) {
      return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 })
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Genji Monthly Subscription',
              description: 'Access to premium features',
            },
            unit_amount: 100, // $1.00 in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribe`,
      metadata: {
        walletAddress,
      },
    })

    // Return the checkout URL
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { message: 'Failed to create checkout session', error: String(error) },
      { status: 500 }
    )
  }
}
