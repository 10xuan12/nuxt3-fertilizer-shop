<template>
  <div class="container mx-auto p-4">
    <!-- 促銷橫幅 -->
    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
      <strong>春季促銷：</strong> 全館滿千免運，指定商品 9 折！
    </div>
    <h1 class="text-3xl font-bold mb-4">歡迎來到肥料店</h1>
    <h2 class="text-xl font-semibold mb-2">最新商品</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from '~/components/ProductCard.vue'
import { useCartStore } from '~/store/cart'
const cart = useCartStore()
const { $toast } = useNuxtApp()

const products = [
  { id: 1, name: '有機肥料 A', price: 300, description: '高效能有機肥料', image: '/placeholder-images-image_large.webp' },
  { id: 2, name: '化學肥料 B', price: 250, description: '速效型化學肥料', image: '/placeholder-images-image_large.webp' },
  // 更多產品...
]

function addToCart(product) {
  cart.addToCart({ ...product, quantity: 1 })
  $toast.success('已加入購物車！')
}
</script>
