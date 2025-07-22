import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress, customerEmail, userId } = body

    // Validate required fields
    if (!items || !shippingAddress || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate total from items
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Create mock order response
    const order = {
      id: `order_${Date.now()}`,
      userId: userId || null,
      total: total,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      shippingAddress: {
        ...shippingAddress,
        email: customerEmail,
      },
      items: items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}