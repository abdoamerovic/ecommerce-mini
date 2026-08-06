import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  productId: string
  name: string
  size: string
  color: string
  price: number
  image: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, delta: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items
        const existing = items.find(
          (i) =>
            i.productId === newItem.productId &&
            i.size === newItem.size &&
            i.color === newItem.color
        )

        if (existing) {
          set({
            items: items.map((i) =>
              i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
            ),
          })
        } else {
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        })
      },

      updateQuantity: (productId, size, color, delta) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(1, i.quantity + delta) }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart", 
    }
  )
)