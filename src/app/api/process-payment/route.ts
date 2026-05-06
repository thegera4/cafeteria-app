import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { client } from '@/sanity/lib/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transaction_amount, token, description, installments, payment_method_id, issuer_id, payer, items, tableNumber, userId } = body

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('Mercado Pago Access Token is missing')
    }

    const mpClient = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN })
    const payment = new Payment(mpClient)

    const paymentResponse = await payment.create({
      body: {
        transaction_amount,
        token,
        description: description || 'Cafeteria Order',
        installments,
        payment_method_id,
        issuer_id,
        payer: {
          email: payer?.email || 'test@test.com',
          identification: payer?.identification,
        },
      },
    })

    if (paymentResponse.status === 'approved' || paymentResponse.status === 'in_process') {
      // Create Sanity Order
      await client.withConfig({ token: process.env.SANITY_API_TOKEN }).create({
        _type: 'order',
        tableNumber: tableNumber || 'Unknown',
        totalPrice: transaction_amount,
        paymentStatus: paymentResponse.status === 'approved' ? 'paid' : 'pending',
        orderStatus: 'received',
        mercadoPagoPaymentId: paymentResponse.id?.toString(),
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
    }

    return NextResponse.json(paymentResponse)
  } catch (error: any) {
    console.error('Payment Error:', error)
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
