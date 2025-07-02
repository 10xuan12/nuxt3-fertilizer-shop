<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-4">購物車</h1>
    <div v-if="cartStore.cart.length === 0" class="text-center text-gray-500">購物車是空的</div>
    <div v-else>
      <CartItem
        v-for="item in cartStore.cart"
        :key="item.id"
        :item="item"
        @update-quantity="onUpdateQuantity"
        @remove="onRemove"
      />
      <div class="flex justify-between items-center font-bold text-lg mt-6">
        <span>總計</span>
        <span>NT$ {{ cartStore.totalPrice }}</span>
      </div>
      <NuxtLink
        v-if="cartStore.cart.length > 0"
        to="/checkout"
        class="mt-4 w-full inline-block text-center py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-lg transition-all duration-200 focus:ring-2 focus:ring-yellow-300 active:scale-95"
      >
        前往結帳
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../store/cart'
import CartItem from '../components/CartItem.vue'
import { onMounted } from 'vue'

const cartStore = useCartStore()

function onUpdateQuantity(id: number, qty: number) {
  cartStore.updateQuantity(id, qty)
}
function onRemove(id: number) {
  cartStore.removeFromCart(id)
}

onMounted(() => {
  console.log('購物車頁 cart 狀態:', cartStore.cart)
})
</script>
