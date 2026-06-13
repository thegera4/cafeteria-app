import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { Header } from '@/components/Header'
import { CouponCard } from '@/components/CouponCard'
import { CartSidebar } from '@/components/CartSidebar'

export const dynamic = 'force-dynamic'

export default async function RewardsPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>
}) {
  const user = await currentUser()
  const { table } = await searchParams

  if (!user) {
    redirect(table ? `/?sign-in=true&table=${table}` : '/?sign-in=true')
  }

  const query = `
    *[_type == "coupon" && isActive == true && validFrom <= now() && validUntil >= now() && !(_id in *[_type == "order" && userId == $userId && defined(appliedCoupon)].appliedCoupon._ref)] {
      _id,
      title,
      code,
      discountType,
      discountValue,
      validUntil
    } | order(validUntil asc)
  `
  
  const coupons = await client.fetch(query, { userId: user.id })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">
            Your Exclusive Rewards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Redeem these special offers on your next order. Act fast before they expire!
          </p>
        </div>
        
        {coupons.length === 0 ? (
          <div className="bg-surface border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No rewards available right now</h2>
            <p className="text-gray-500">Check back later for special holiday discounts and exclusive offers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((coupon: any) => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
        )}
      </div>
      <CartSidebar />
    </div>
  )
}
