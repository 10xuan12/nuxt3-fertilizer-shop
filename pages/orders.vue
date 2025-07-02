<template>
  <div class="container mx-auto p-4 max-w-3xl">
    <h1 class="text-3xl font-bold mb-6">訂單查詢</h1>
    <div v-if="orders.length === 0" class="text-gray-500">目前沒有任何訂單。</div>
    <div v-else class="space-y-6">
      <div v-for="order in orders" :key="order.id" class="border rounded shadow p-4 bg-white">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <div class="font-semibold">訂單編號：{{ order.id }}</div>
            <div class="text-gray-500 text-sm">下單日期：{{ order.date }}</div>
          </div>
          <div class="mt-2 md:mt-0">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold"
              :class="order.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
              {{ order.status }}
            </span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mb-2">
          <span v-for="item in order.items" :key="item.id" class="bg-gray-100 rounded px-2 py-1 text-sm">{{ item.name }} x {{ item.quantity }}</span>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-gray-700">總金額：<span class="font-bold text-green-700">NT$ {{ order.total }}</span></div>
          <NuxtLink :to="`/orders/${order.id}`" class="text-blue-600 hover:underline">查看詳情</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const orders = [
  {
    id: '20240701001',
    date: '2024-07-01',
    status: '已完成',
    total: 1200,
    items: [
      { id: 1, name: '有機肥料 A', quantity: 2 },
      { id: 2, name: '液體肥料 B', quantity: 1 }
    ]
  },
  {
    id: '20240628002',
    date: '2024-06-28',
    status: '處理中',
    total: 450,
    items: [
      { id: 3, name: '速效化肥 C', quantity: 1 }
    ]
  }
]
</script> 