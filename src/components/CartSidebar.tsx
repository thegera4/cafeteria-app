'use client'

import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function CartSidebar() {
  const isOpen = useCartStore((state) => state.isOpen)
  const setIsOpen = useCartStore((state) => state.setIsOpen)
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const getCartTotal = useCartStore((state) => state.getCartTotal)
  const appliedCoupon = useCartStore((state) => state.appliedCoupon)
  const removeCoupon = useCartStore((state) => state.removeCoupon)
  const router = useRouter()
  
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-background shadow-2xl z-[101] flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-primary">Your Order</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-primary hover:bg-surface-variant rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Your bag is empty.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-surface rounded-xl border border-slate-200 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-surface-variant rounded-lg p-1 border border-primary-light/30">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-primary transition-colors bg-white shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-primary w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-primary transition-colors bg-white shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-surface mt-auto">
            <div className="flex items-center justify-between mb-2 text-gray-600">
              <span className="text-md font-medium">Subtotal</span>
              <span className="text-lg font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex items-center justify-between mb-2 text-green-600">
                <div className="flex items-center gap-2">
                  <span className="text-md font-bold">Discount ({appliedCoupon.code})</span>
                  <button
                    onClick={removeCoupon}
                    className="p-0.5 text-green-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-lg font-bold">
                  -${(subtotal - getCartTotal()).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-gray-900">Grand Total</span>
              <span className="text-2xl font-bold text-primary">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setIsOpen(false); router.push('/checkout'); }}
                className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg"
              >
                Go to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
