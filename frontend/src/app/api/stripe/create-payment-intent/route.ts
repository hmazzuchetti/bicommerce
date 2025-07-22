import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Mock payment intent response for development
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      clientSecret: `pi_${Date.now()}_secret_test`,
      status: 'requires_payment_method',
      amount: 0, // This would normally come from the order
      currency: 'usd',
    }

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}