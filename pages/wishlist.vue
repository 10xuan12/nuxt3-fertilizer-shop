<template>
  <div class="container mx-auto p-4 max-w-3xl">
    <h1 class="text-3xl font-bold mb-6">收藏清單</h1>
    <div v-if="wishlistStore.wishlist.length === 0" class="text-gray-500 text-center">目前沒有收藏任何商品。</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in wishlistStore.wishlist" :key="item.id" class="border rounded shadow p-4 bg-white flex flex-col">
        <NuxtLink :to="`/products/${item.id}`" class="mb-2">
          <img :src="item.image || '/placeholder-images-image_large.webp'" :alt="item.name" class="w-full h-32 object-cover rounded" />
        </NuxtLink>
        <div class="flex-1">
          <div class="font-bold text-gray-800">{{ item.name }}</div>
          <div class="text-green-600 font-semibold">NT$ {{ item.price }}</div>
        </div>
        <button @click="wishlistStore.remove(item.id)" class="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-all">移除</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlistStore } from '../store/wishlist'
import { onMounted } from 'vue'

const wishlistStore = useWishlistStore()

onMounted(() => {
  console.log('願望清單頁 wishlist 狀態:', wishlistStore.wishlist)
})
</script> 