'use client'

import { useClerk } from '@clerk/nextjs'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function SignInTrigger() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { openSignIn } = useClerk()
  
  useEffect(() => {
    if (searchParams.get('sign-in') === 'true') {
      openSignIn({ 
        fallbackRedirectUrl: '/rewards',
      })
      
      // Optional: remove the sign-in param from URL so it doesn't reopen on refresh
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('sign-in')
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    }
  }, [searchParams, openSignIn, router, pathname])
  
  return null
}
