import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: any
}

interface CartStore {
  items: CartItem[]
  tableNumber: string | null
  isOpen: boolean
  setTableNumber: (table: string) => void
  setIsOpen: (isOpen: boolean) => void
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  tableNumber: null,
  isOpen: false,
  setTableNumber: (table) => set({ tableNumber: table }),
  setIsOpen: (isOpen) => set({ isOpen }),
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id)
    if (existing) {
      return {
        items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
    }
    return { items: [...state.items, item] }
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) return { items: state.items.filter(i => i.id !== id) }
    return {
      items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
    }
  }),
  clearCart: () => set({ items: [] }),
  getCartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
}))
