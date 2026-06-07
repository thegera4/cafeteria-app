import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, totalAmount, tableNumber, userId, appliedCouponId } = body

    if (!process.env.SANITY_API_TOKEN) {
      throw new Error('Sanity API Token is missing')
    }

    let finalTotal = totalAmount;
    let couponRef = undefined;

    if (appliedCouponId) {
      const coupon = await client.fetch(`*[_type == "coupon" && _id == $id][0]`, { id: appliedCouponId });
      if (!coupon || !coupon.isActive) {
        throw new Error("Invalid or inactive coupon.");
      }
      // Check for one-time use if userId is present
      if (userId) {
        const existingOrder = await client.fetch(
          `*[_type == "order" && userId == $userId && appliedCoupon._ref == $id][0]`,
          { userId, id: appliedCouponId }
        );
        if (existingOrder) {
          throw new Error("You have already used this coupon.");
        }
      }

      // Calculate subtotal from items
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      if (coupon.discountType === 'percentage') {
        finalTotal = Math.max(0, subtotal - (subtotal * (coupon.discountValue / 100)));
      } else {
        finalTotal = Math.max(0, subtotal - coupon.discountValue);
      }
      
      couponRef = {
        _type: 'reference',
        _ref: appliedCouponId
      };
    }

    const order = await client.withConfig({ token: process.env.SANITY_API_TOKEN }).create({
      _type: 'order',
      tableNumber: tableNumber || 'Unknown',
      totalPrice: finalTotal,
      paymentStatus: 'pending',
      orderStatus: 'received',
      userId: userId || null,
      appliedCoupon: couponRef,
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
