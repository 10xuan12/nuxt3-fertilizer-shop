<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-green-700 mb-6">產品列表</h1>
    <!-- 搜尋、分類、排序區塊 -->
    <div class="flex flex-col md:flex-row md:items-end md:space-x-4 mb-4 space-y-2 md:space-y-0">
      <div class="flex-1">
        <label class="block font-semibold mb-1">搜尋商品</label>
        <input v-model="search" type="text" placeholder="輸入商品名稱關鍵字" class="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label class="block font-semibold mb-1">分類</label>
        <div class="flex flex-wrap gap-2">
          <label v-for="cat in categories" :key="cat" class="inline-flex items-center">
            <input type="checkbox" v-model="selectedCategories" :value="cat" class="mr-1" />{{ cat }}
          </label>
        </div>
      </div>
      <div>
        <label class="block font-semibold mb-1">價格排序</label>
        <select v-model="sort" class="border rounded px-2 py-1">
          <option value="">預設</option>
          <option value="asc">價格低到高</option>
          <option value="desc">價格高到低</option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useNuxtApp, type NuxtApp } from '#app'
import { useCartStore, type CartItem } from '../store/cart'

const cart = useCartStore()
const { $toast } = useNuxtApp()

const products = [
  { id: 1, name: '有機肥料 A', price: 300, description: '促進植物健康生長', category: '有機', image: '/placeholder-images-image_large.webp' },
  { id: 2, name: '液體肥料 B', price: 450, description: '方便噴灑的液體配方', category: '液體', image: '/placeholder-images-image_large.webp' },
  { id: 3, name: '速效化肥 C', price: 280, description: '快速吸收，立即見效', category: '化學', image: '/placeholder-images-image_large.webp' },
  { id: 4, name: '堆肥 D', price: 200, description: '環保天然堆肥', category: '有機', image: '/placeholder-images-image_large.webp' }
]

const categories = Array.from(new Set(products.map(p => p.category)))
const selectedCategories = ref<string[]>([])
const search = ref('')
const sort = ref('')

const filteredProducts = computed(() => {
  let result = products
  // 搜尋
  if (search.value) {
    result = result.filter(p => p.name.includes(search.value) || p.description.includes(search.value))
  }
  // 分類多選
  if (selectedCategories.value.length > 0) {
    result = result.filter(p => selectedCategories.value.includes(p.category))
  }
  // 價格排序
  if (sort.value === 'asc') {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (sort.value === 'desc') {
    result = [...result].sort((a, b) => b.price - a.price)
  }
  return result
})

function addToCart(product: Omit<CartItem, 'quantity'>) {
  cart.addToCart({ ...product, quantity: 1 })
  console.log('商品列表頁 cart 狀態:', cart.cart)
  $toast.success('已加入購物車！')
}
</script>
