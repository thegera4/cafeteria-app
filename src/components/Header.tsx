'use client'

import { ShoppingBag, Coffee } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { CartSidebar } from './CartSidebar'

export function Header() {
  const items = useCartStore((state) => state.items)
  const tableNumber = useCartStore((state) => state.tableNumber)
  const setIsOpen = useCartStore((state) => state.setIsOpen)
  const { isLoaded, isSignedIn } = useAuth()

  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Coffee className="w-6 h-6" />
            <span>Cafeteria</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-foreground/80">
            <Link href="/" className="hover:text-primary transition-colors">Menu</Link>
            <Link href="/rewards" className="hover:text-primary transition-colors">Rewards</Link>
          </nav>
          
          <div className="flex items-center gap-6">
            {tableNumber && (
              <div className="hidden sm:flex items-center gap-2 bg-primary-light/20 text-primary-container px-3 py-1 rounded-full text-sm font-semibold">
                Table {tableNumber}
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {isLoaded && !isSignedIn && (
                <SignInButton mode="modal">
                  <button className="text-sm font-medium hover:text-primary transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              )}
              {isLoaded && isSignedIn && (
                <UserButton />
              )}
            </div>
          </div>
        </div>
      </header>

      {totalItems > 0 && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 font-bold group cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-primary bg-white rounded-full shadow-sm">
              {totalItems}
            </span>
          </div>
          <span className="text-lg tracking-wide">Order Now</span>
        </button>
      )}

      <CartSidebar />
    </>
  )
}
