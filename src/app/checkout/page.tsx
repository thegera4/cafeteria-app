'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Header } from '@/components/Header'
import { MercadoPagoWrapper } from '@/components/MercadoPagoWrapper'
import { MPPaymentBrick } from '@/components/MPPaymentBrick'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { X } from 'lucide-react'

export default function CheckoutPage() {
  const { items, tableNumber, getCartTotal, clearCart, appliedCoupon, removeCoupon } = useCartStore()
  const { userId } = useAuth()
  const router = useRouter()
  const [paymentMode, setPaymentMode] = useState<'app' | 'later' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(10)

  // Countdown timer effect
  useEffect(() => {
    if (!orderConfirmed) return

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [orderConfirmed])

  // Redirect effect (runs outside the state updater function to avoid React render errors)
  useEffect(() => {
    if (orderConfirmed && countdown <= 0) {
      router.push(tableNumber ? `/?table=${tableNumber}` : '/')
    }
  }, [countdown, orderConfirmed, router, tableNumber])

  // Ensure total is a valid number rounded to 2 decimal places to satisfy payment APIs (especially with coupon discounts)
  const total = Number(getCartTotal().toFixed(2))
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handlePaymentSuccess = useCallback((id: string) => {
    clearCart()
    setOrderConfirmed(true)
  }, [clearCart])

  const handlePayLater = useCallback(async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: total,
          tableNumber,
          userId,
          appliedCouponId: appliedCoupon?.id
        })
      })
      if (!res.ok) throw new Error('Failed to create order')
      clearCart()
      setOrderConfirmed(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }, [items, total, tableNumber, userId, appliedCoupon, clearCart])

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-primary-light/20 text-primary-container rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you for your order. We are preparing it now.</p>
          <p className="text-sm text-gray-500 mb-8 font-medium">
            Redirecting to the menu in <span className="font-semibold text-primary">{countdown}</span> seconds...
          </p>
          <button 
            onClick={() => router.push(tableNumber ? `/?table=${tableNumber}` : '/')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-container transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <button 
            onClick={() => router.push(tableNumber ? `/?table=${tableNumber}` : '/')} 
            className="text-primary hover:underline"
          >
            Go back to the menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-surface rounded-xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-800">{item.quantity}x</span> {item.name}
                  </div>
                  <span className="font-medium text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {appliedCoupon && (
              <div className="border-t pt-4 flex justify-between items-center text-lg text-green-600 font-bold">
                <div className="flex items-center gap-2">
                  <span>Discount ({appliedCoupon.code})</span>
                  <button
                    onClick={removeCoupon}
                    className="p-0.5 text-green-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <span>-${(subtotal - total).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            {tableNumber && (
              <div className="mt-4 text-sm text-gray-500 text-center">
                Ordering for Table <span className="font-bold text-gray-800">{tableNumber}</span>
              </div>
            )}
          </div>

          {/* Payment Selection */}
          <div className="space-y-6">
            {!paymentMode && (
              <>
                <h2 className="text-xl font-bold mb-4">How would you like to pay?</h2>
                <div className="grid gap-4">
                  <button 
                    onClick={() => setPaymentMode('app')}
                    className="bg-surface border-2 border-primary text-primary p-4 rounded-lg font-bold hover:bg-primary-light/10 transition-colors"
                  >
                    Pay Now
                  </button>
                  <button 
                    onClick={() => setPaymentMode('later')}
                    className="bg-primary-container text-white p-4 rounded-lg font-bold hover:bg-primary transition-colors"
                  >
                    Pay Later
                  </button>
                </div>
              </>
            )}

            {paymentMode === 'app' && (
              <div>
                <button onClick={() => setPaymentMode(null)} className="text-sm text-gray-500 mb-4 hover:underline">
                  ← Back to options
                </button>
                <div className="bg-surface p-4 rounded-xl border border-slate-200">
                  <MercadoPagoWrapper>
                    <MPPaymentBrick onPaymentSuccess={handlePaymentSuccess} />
                  </MercadoPagoWrapper>
                </div>
              </div>
            )}

            {paymentMode === 'later' && (
              <div className="bg-surface p-6 rounded-xl border border-slate-200 text-center">
                <button onClick={() => setPaymentMode(null)} className="text-sm text-gray-500 mb-6 hover:underline block mx-auto">
                  ← Back to options
                </button>
                <h3 className="font-bold text-lg mb-2">Pay Later</h3>
                <p className="text-gray-600 mb-6">We will prepare your order and you can pay at the end.</p>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <button 
                  onClick={handlePayLater}
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-lg font-bold hover:bg-primary-container disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
