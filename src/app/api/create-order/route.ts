import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, totalAmount, tableNumber, userId } = body

    if (!process.env.SANITY_API_TOKEN) {
      throw new Error('Sanity API Token is missing')
    }

    const order = await client.withConfig({ token: process.env.SANITY_API_TOKEN }).create({
      _type: 'order',
      tableNumber: tableNumber || 'Unknown',
      totalPrice: totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'received',
      userId: userId || null,
      items: items.map((item: any) => ({
        _key: crypto.randomUUID(),
        product: {
          _type: 'reference',
          _ref: item.id,
        },
        quantity: item.quantity,
        priceAtTime: item.price,
      })),
    })

    return NextResponse.json({ success: true, orderId: order._id })
  } catch (error: any) {
    console.error('Order Creation Error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
