<template>
  <div class="relative border p-4 rounded shadow hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 bg-white cursor-pointer">
    <button
      @click.stop="toggleWishlist(product)"
      class="absolute top-2 right-2 z-10 text-red-500 hover:scale-110 transition-transform"
      :aria-label="isWishlisted ? '移除收藏' : '加入收藏'"
    >
      <svg v-if="isWishlisted" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" class="w-7 h-7">
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.829a4 4 0 010-5.656z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
      </svg>
    </button>
    <NuxtLink
      v-if="product"
      :to="`/products/${product.id}`"
      class="block hover:no-underline"
    >
      <img
        :src="product.image || '/placeholder-images-image_large.webp'"
        alt="product"
        class="w-full h-40 object-cover mb-4 rounded transition-opacity duration-500"
      />
      <h2 class="text-xl font-bold text-gray-800">{{ product.name }}</h2>
      <p class="text-gray-600 text-sm mb-2">{{ product.description }}</p>
      <p class="text-lg text-green-600 font-semibold">NT$ {{ product.price }}</p>
      </NuxtLink>
      <button
        class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-all duration-200 focus:ring-2 focus:ring-green-300 active:scale-95"
        @click="$emit('add-to-cart', product)"
        type="button"
      >
        加入購物車
      </button>
  </div>
</template>

<script setup lang="ts">
import { useWishlistStore } from '../store/wishlist'
import { computed } from 'vue'
const props = defineProps({
  product: Object
})
defineEmits(['add-to-cart'])

const wishlist = useWishlistStore()
const isWishlisted = computed(() => props.product && wishlist.isInWishlist(props.product.id))

function toggleWishlist(product: any) {
  if (!product) return
  if (wishlist.isInWishlist(product.id)) {
    wishlist.remove(product.id)
  } else {
    wishlist.add(product)
  }
}
</script>
