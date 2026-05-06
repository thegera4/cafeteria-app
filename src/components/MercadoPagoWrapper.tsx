'use client'

import { useEffect, useState } from 'react'
import { initMercadoPago } from '@mercadopago/sdk-react'

export function MercadoPagoWrapper({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    if (publicKey && !isInitialized) {
      initMercadoPago(publicKey, { locale: 'es-MX' })
      setIsInitialized(true)
    }
  }, [isInitialized])

  if (!isInitialized) return null

  return <>{children}</>
}
