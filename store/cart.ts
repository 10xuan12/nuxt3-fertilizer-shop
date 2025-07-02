import { defineStore } from 'pinia'

export interface CartItem {
  id: number | string
  name: string
  price: number
  image: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [] as CartItem[] // [{ id, name, price, image, quantity }]
  }),
  getters: {
    totalPrice(state): number {
      return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    totalCount(state): number {
      return state.cart.reduce((sum, item) => sum + item.quantity, 0)
    }
  },
  actions: {
    addToCart(product: Partial<CartItem> & { id: number | string }): void {
      const exist = this.cart.find(item => item.id === product.id)
      if (exist) {
        exist.quantity += product.quantity || 1
      } else {
        this.cart.push({ ...product, quantity: product.quantity || 1 } as CartItem)
      }
    },
    removeFromCart(productId: number | string): void {
      this.cart = this.cart.filter(item => item.id !== productId)
    },
    updateQuantity(productId: number | string, quantity: number): void {
      const item = this.cart.find(item => item.id === productId)
      if (item && quantity > 0) {
        item.quantity = quantity
      } else if (item && quantity <= 0) {
        this.removeFromCart(productId)
      }
    },
    clearCart(): void {
      this.cart = []
    }
  }
})

// 為 TypeScript 提供模組型別宣告
// 這段可複製到 types/cart.d.ts 以解決型別錯誤
// declare module '~/store/cart' {
//   export * from '../store/cart'
// } 