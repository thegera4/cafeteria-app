'use client'

import { Payment } from '@mercadopago/sdk-react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function MPPaymentBrick({ onPaymentSuccess }: { onPaymentSuccess: (id: string) => void }) {
  const [error, setError] = useState<string | null>(null)
  const getCartTotal = useCartStore((state) => state.getCartTotal)
  const items = useCartStore((state) => state.items)
  const total = getCartTotal()
  
  const initialization = {
    amount: total,
  }

  const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, items }),
      })
      const data = await response.json()
      if (response.ok) {
        onPaymentSuccess(data.id.toString())
      } else {
        setError(data.message || 'Payment failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const onError = async (error: any) => {
    console.error(error)
  }

  const onReady = async () => {
    // Brick is ready
  }

  return (
    <div className="w-full">
      {error && <div className="text-red-500 mb-4 font-medium">{error}</div>}
      <Payment
        initialization={initialization}
        customization={{
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            mercadoPago: 'all',
          },
        }}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </div>
  )
}
