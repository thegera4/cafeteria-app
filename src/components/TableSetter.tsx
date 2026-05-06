'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

function TableSetterInner() {
  const searchParams = useSearchParams()
  const setTableNumber = useCartStore((state) => state.setTableNumber)
  
  useEffect(() => {
    const table = searchParams.get('table')
    if (table) {
      setTableNumber(table)
    }
  }, [searchParams, setTableNumber])

  return null
}

export function TableSetter() {
  return (
    <Suspense fallback={null}>
      <TableSetterInner />
    </Suspense>
  )
}
