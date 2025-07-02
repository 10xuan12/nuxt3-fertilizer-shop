<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <div v-if="post">
      <h1 class="text-2xl font-bold mb-2 text-green-700">{{ post.title }}</h1>
      <div class="text-gray-500 text-sm mb-4">{{ post.date }}</div>
      <div class="text-gray-700 whitespace-pre-line">{{ post.content }}</div>
      <NuxtLink to="/news" class="inline-block mt-8 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all">返回最新消息</NuxtLink>
    </div>
    <div v-else class="text-gray-400">查無此文章。</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const allPosts = [
  { id: 1, title: '夏季促銷活動開跑！', date: '2024-07-01', content: `全館指定商品9折，滿千免運，快來搶購！\n活動期間：7/1~7/15\n更多詳情請見官網。` },
  { id: 2, title: '有機肥料的正確使用方法', date: '2024-06-25', content: `教你如何選擇與施用有機肥料：\n1. 依作物需求選擇適合的肥料種類\n2. 適量施用，避免過量\n3. 配合土壤改良效果更佳` },
  { id: 3, title: '農業小知識：土壤改良技巧', date: '2024-06-20', content: `改善土壤結構的技巧：\n- 增加有機質\n- 適度翻土\n- 定期檢測土壤酸鹼值` }
]
const post = allPosts.find(p => p.id === Number(route.params.id))
</script> 