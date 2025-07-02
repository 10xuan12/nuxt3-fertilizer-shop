<template>
  <div class="container mx-auto p-4 max-w-3xl">
    <h1 class="text-3xl font-bold mb-6">最新消息 / 部落格</h1>
    <div v-if="posts.length === 0" class="text-gray-500 text-center">目前沒有任何消息。</div>
    <div v-else class="space-y-6">
      <div v-for="post in posts" :key="post.id" class="border rounded shadow p-4 bg-white">
        <NuxtLink :to="`/news/${post.id}`" class="block hover:no-underline">
          <div class="font-bold text-xl mb-2 text-green-700">{{ post.title }}</div>
          <div class="text-gray-500 text-sm mb-2">{{ post.date }}</div>
          <div class="text-gray-700 line-clamp-2">{{ post.summary }}</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const posts = [
  { id: 1, title: '夏季促銷活動開跑！', date: '2024-07-01', summary: '全館指定商品9折，滿千免運，快來搶購！' },
  { id: 2, title: '有機肥料的正確使用方法', date: '2024-06-25', summary: '教你如何選擇與施用有機肥料，讓作物更健康。' },
  { id: 3, title: '農業小知識：土壤改良技巧', date: '2024-06-20', summary: '改善土壤結構，提升作物產量的實用技巧。' }
]
</script> 