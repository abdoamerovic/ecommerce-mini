import { create } from "zustand"
import { persist } from "zustand/middleware"

export type WishlistItem = {
  productId: string
  name: string
  price: number
  image: string
}

type WishlistState = {
  items: WishlistItem[]
  toggleItem: (item: WishlistItem) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId)
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== item.productId) })
        } else {
          set({ items: [...get().items, item] })
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist",
    }
  )
)