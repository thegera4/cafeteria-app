import { getCategoriesQuery, getAllProductsQuery } from '@/sanity/lib/queries'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { MenuClient } from '@/components/MenuClient'
import { Header } from '@/components/Header'
import { TableSetter } from '@/components/TableSetter'
import { HeroCarousel } from '@/components/HeroCarousel'

export default async function Page() {
  // Fetch all data server-side concurrently
  const [{ data: categories }, { data: products }] = await Promise.all([
    sanityFetch({ query: getCategoriesQuery }),
    sanityFetch({ query: getAllProductsQuery })
  ])

  return (
    <main className="min-h-screen bg-background">
      <TableSetter />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <HeroCarousel />
        <MenuClient categories={categories} products={products} itemsPerPage={9} />
      </div>
      <SanityLive />
    </main>
  )
}
