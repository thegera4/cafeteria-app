'use client'

import { Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  imageUrl: string
  categorySlug: string
  description: string
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const items = useCartStore((state) => state.items)
  
  const cartItem = items.find(item => item.id === product._id)
  const quantityInCart = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl,
    })
  }

  const handleIncrement = () => {
    updateQuantity(product._id, quantityInCart + 1)
  }

  const handleDecrement = () => {
    updateQuantity(product._id, quantityInCart - 1)
  }

  return (
    <div className="bg-surface rounded-xl border border-slate-200 overflow-hidden flex flex-col group transition-colors hover:border-primary-light">
      <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
          <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description || 'A delicious item from our menu.'}
        </p>
        
        {quantityInCart > 0 ? (
          <div className="w-full flex items-center justify-between bg-surface-variant rounded-lg p-1 border border-primary-light/30">
            <button 
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white text-primary transition-colors bg-white shadow-sm"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-primary w-8 text-center">{quantityInCart}</span>
            <button 
              onClick={handleIncrement}
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white text-primary transition-colors bg-white shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleAdd}
            className="w-full bg-surface-variant text-primary hover:bg-primary hover:text-on-primary transition-colors font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 border border-transparent"
          >
            <Plus className="w-4 h-4" />
            Add to Order
          </button>
        )}
      </div>
    </div>
  )
}