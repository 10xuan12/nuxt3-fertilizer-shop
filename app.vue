<template>
  <div>
    <!-- Navbar -->
    <nav class="flex flex-col md:flex-row items-center justify-between bg-green-700 px-4 py-3 shadow text-white mb-6">
      <div class="flex items-center space-x-2 mb-2 md:mb-0">
        <NuxtLink to="/" class="text-2xl font-bold tracking-wide hover:text-green-200 transition">肥料店商平台</NuxtLink>
      </div>
      <div class="flex flex-wrap gap-2 md:space-x-4">
        <NuxtLink to="/" class="hover:text-green-200 transition text-lg">首頁</NuxtLink>
        <NuxtLink to="/news" class="hover:text-green-200 transition text-lg">最新消息</NuxtLink>
        <NuxtLink to="/products" class="hover:text-green-200 transition text-lg">商品列表</NuxtLink>
        <NuxtLink to="/cart" class="relative hover:text-green-200 transition text-lg">
          購物車
          <span v-if="cartCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-2 py-0.5 animate-bounce">{{ cartCount }}</span>
        </NuxtLink>
        <NuxtLink to="/checkout" class="hover:text-green-200 transition text-lg">結帳</NuxtLink>
        <NuxtLink to="/wishlist" class="relative hover:text-green-200 transition text-lg">收藏清單
          <span v-if="wishlistCount > 0" class="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-2 py-0.5 animate-bounce">{{ wishlistCount }}</span>
        </NuxtLink>
        <NuxtLink to="/orders" class="hover:text-green-200 transition text-lg">訂單查詢</NuxtLink>
        <NuxtLink to="/faq" class="hover:text-green-200 transition text-lg">常見問題</NuxtLink>
        
      </div>
    </nav>
    <!-- 主內容區 -->
    <div class="min-h-[70vh]">
      <NuxtPage />
    </div>
    <!-- Footer -->
    <footer class="text-center text-gray-500 py-4 text-sm bg-gray-50 mt-8">© 2024 肥料店商平台</footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const cartCount = computed(() => cartStore.totalCount)
const wishlistCount = computed(() => wishlistStore.wishlistCount)
</script>

<style>
/* 讓 Navbar 連結有點動畫 */
.router-link-exact-active {
  text-decoration: underline;
  text-underline-offset: 4px;
  color: #bbf7d0 !important;
}
</style>