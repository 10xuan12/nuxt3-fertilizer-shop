import { defineStore } from 'pinia'

interface WishlistItem {
  id: number | string
  name: string
  price: number
  image: string
}

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    wishlist: [] as WishlistItem[] // [{ id, name, price, image }]
  }),
  actions: {
    add(product: WishlistItem): void {
      if (!this.wishlist.find(item => item.id === product.id)) {
        this.wishlist.push(product)
      }
    },
    remove(productId: number | string): void {
      this.wishlist = this.wishlist.filter(item => item.id !== productId)
    },
    clear(): void {
      this.wishlist = []
    }
  },
  getters: {
    isInWishlist: (state) => (id: number | string): boolean => {
      return state.wishlist.some(item => item.id === id)
    },
    wishlistCount(state): number {
      return state.wishlist.length
    }
  }
}) 