'use client'

import { useCartStore } from '@/store/cartStore'
import { TicketPercent, Clock, CheckCircle, XCircle } from 'lucide-react'

export function CouponCard({ coupon }: { coupon: any }) {
  const applyCoupon = useCartStore(state => state.applyCoupon)
  const removeCoupon = useCartStore(state => state.removeCoupon)
  const appliedCoupon = useCartStore(state => state.appliedCoupon)
  const setIsOpen = useCartStore(state => state.setIsOpen)
  
  const isApplied = appliedCoupon?.id === coupon._id
  
  const handleApplyToggle = () => {
    if (isApplied) {
      removeCoupon()
    } else {
      applyCoupon({
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      })
      setIsOpen(true)
    }
  }

  // Format date nicely
  const validUntil = new Date(coupon.validUntil).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${isApplied ? 'border-primary shadow-primary/20 shadow-lg scale-[1.02]' : 'border-transparent bg-surface shadow-md hover:shadow-xl hover:-translate-y-1'}`}>
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
      
      <div className="relative p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <TicketPercent className="w-8 h-8" />
            </div>
            {isApplied && (
              <span className="bg-green-100 text-green-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center border border-green-200 shadow-sm animate-pulse">
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-600" />
                APPLIED
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-gray-900">
              {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`} OFF
            </div>
            <div className="text-xs font-bold tracking-wider text-gray-500 uppercase">
              Use code: <span className="text-primary bg-primary/10 px-2 py-0.5 rounded ml-1">{coupon.code}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6 flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{coupon.title}</h3>
          <div className="flex items-center text-sm text-orange-500 font-medium bg-orange-50 w-fit px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 mr-1.5" />
            Expires {validUntil}
          </div>
        </div>
        
        <button
          onClick={handleApplyToggle}
          className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
            isApplied 
            ? 'bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100' 
            : 'bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg'
          }`}
        >
          {isApplied ? (
            <>
              <XCircle className="w-5 h-5 mr-2" />
              Remove Coupon
            </>
          ) : (
            'Apply to Order'
          )}
        </button>
      </div>
      
      {/* Ticket perforations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-background rounded-full border-r-2 border-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-background rounded-full border-l-2 border-transparent" />
    </div>
  )
}
