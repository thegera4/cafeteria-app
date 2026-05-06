'use client'

import { useState, useRef, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { Utensils, Cake, Coffee, CupSoda, Sandwich, LayoutGrid } from 'lucide-react'

interface Category {
  _id: string
  name: string
  slug: string
}

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  imageUrl: string
  categorySlug: string
  description: string
}

interface MenuClientProps {
  categories: Category[]
  products: Product[]
  itemsPerPage?: number
}

const getCategoryIcon = (slug: string | null) => {
  switch (slug) {
    case 'cakes': return <Cake className="w-6 h-6 mb-1" />
    case 'drinks': return <Coffee className="w-6 h-6 mb-1" />
    case 'juices': return <CupSoda className="w-6 h-6 mb-1" />
    case 'sandwiches': return <Sandwich className="w-6 h-6 mb-1" />
    case null: return <LayoutGrid className="w-6 h-6 mb-1" />
    default: return <Utensils className="w-6 h-6 mb-1" />
  }
}

export function MenuClient({ categories, products, itemsPerPage: defaultItemsPerPage = 9 }: MenuClientProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [dynamicItemsPerPage, setDynamicItemsPerPage] = useState(defaultItemsPerPage)

  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.matchMedia('(orientation: landscape)').matches
      setDynamicItemsPerPage(isLandscape ? 9 : 8)
    }

    // Run initially
    handleResize()

    // Listen to resize events
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Filter products locally
  const filteredProducts = currentCategory 
    ? products.filter(p => p.categorySlug === currentCategory)
    : products

  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / dynamicItemsPerPage))

  // Ensure current page is valid when resizing
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  // Paginate products
  const startIndex = (currentPage - 1) * dynamicItemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + dynamicItemsPerPage)

  const handleCategoryChange = (slug: string | null) => {
    setCurrentCategory(slug)
    setCurrentPage(1) // Reset to first page when changing category
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      // Scroll to the top of the menu container instead of top of page
      // Using setTimeout ensures the DOM has updated before we calculate and scroll
      setTimeout(() => {
        if (menuRef.current) {
          // Account for sticky header (h-16 = 64px) + some padding
          const offsetTop = menuRef.current.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' })
        }
      }, 10)
    }
  }

  return (
    <div ref={menuRef} className="flex flex-col gap-8">
      {/* Category Filter */}
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`flex flex-col items-center justify-center min-w-[80px] pb-3 border-b-2 transition-colors ${
            !currentCategory ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          {getCategoryIcon(null)}
          <span className="font-medium text-sm">All Items</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`flex flex-col items-center justify-center min-w-[80px] pb-3 border-b-2 transition-colors ${
              currentCategory === cat.slug ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {getCategoryIcon(cat.slug)}
            <span className="font-medium text-sm">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No items found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-surface border border-slate-200 text-primary rounded-lg disabled:opacity-50 font-medium hover:bg-surface-variant transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-surface border border-slate-200 text-primary rounded-lg disabled:opacity-50 font-medium hover:bg-surface-variant transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
