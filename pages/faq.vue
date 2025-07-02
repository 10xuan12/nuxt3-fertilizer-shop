<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">常見問題 FAQ</h1>
    <div v-for="(faq, idx) in faqs" :key="idx" class="mb-4">
      <button @click="toggle(idx)" class="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded font-semibold flex justify-between items-center">
        <span>{{ faq.q }}</span>
        <span>{{ openIdx === idx ? '▲' : '▼' }}</span>
      </button>
      <div v-if="openIdx === idx" class="bg-white border rounded-b px-4 py-3 text-gray-700">{{ faq.a }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const faqs = [
  { q: '如何下單購買？', a: '選擇商品加入購物車，進入結帳頁面填寫資料並送出訂單即可。' },
  { q: '有哪些付款方式？', a: '目前支援信用卡、貨到付款。' },
  { q: '運費怎麼計算？', a: '單筆訂單滿千免運，未滿千酌收運費80元。' },
  { q: '多久可以收到商品？', a: '訂單成立後 2-3 個工作天內出貨，配送時間依地區而異。' },
  { q: '如何查詢訂單？', a: '可至「訂單查詢」頁面輸入訂單編號查詢。' },
  { q: '商品有問題怎麼辦？', a: '請聯絡客服或於「聯絡我們」頁面留言，我們會盡快協助處理。' }
]
const openIdx = ref(-1)
function toggle(idx: number) {
  openIdx.value = openIdx.value === idx ? -1 : idx
}
</script> 