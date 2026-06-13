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
      try {
        localStorage.setItem('tableNumber', table)
      } catch (e) {
        console.error('Failed to save table number to localStorage:', e)
      }
    } else {
      try {
        const savedTable = localStorage.getItem('tableNumber')
        if (savedTable) {
          setTableNumber(savedTable)
        }
      } catch (e) {
        console.error('Failed to read table number from localStorage:', e)
      }
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
