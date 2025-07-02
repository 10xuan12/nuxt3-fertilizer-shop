<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">訂單詳情</h1>
    <div v-if="!order" class="text-gray-500">查無此訂單。</div>
    <div v-else class="bg-white rounded shadow p-6">
      <div class="mb-4">
        <div class="font-semibold">訂單編號：{{ order.id }}</div>
        <div class="text-gray-500 text-sm">下單日期：{{ order.date }}</div>
        <div class="mt-2">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold"
            :class="order.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
            {{ order.status }}
          </span>
        </div>
      </div>
      <div class="mb-4">
        <div class="font-medium mb-1">收件人資訊</div>
        <div class="text-gray-700 text-sm">{{ order.receiver.name }} / {{ order.receiver.phone }}</div>
        <div class="text-gray-700 text-sm">{{ order.receiver.address }}</div>
      </div>
      <div class="mb-4">
        <div class="font-medium mb-1">付款方式</div>
        <div class="text-gray-700 text-sm">{{ order.payment === 'credit' ? '信用卡' : '貨到付款' }}</div>
      </div>
      <div class="mb-4">
        <div class="font-medium mb-1">商品明細</div>
        <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center border-b py-2">
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span>NT$ {{ item.price * item.quantity }}</span>
        </div>
      </div>
      <div class="flex justify-between items-center font-bold text-lg mt-6">
        <span>總計</span>
        <span>NT$ {{ order.total }}</span>
      </div>
      <NuxtLink to="/orders" class="inline-block mt-8 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all">返回訂單查詢</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()

// 假資料，實際可改為 API 請求
const allOrders = [
  {
    id: '20240701001',
    date: '2024-07-01',
    status: '已完成',
    total: 1200,
    payment: 'credit',
    receiver: { name: '王小明', phone: '0912345678', address: '台北市信義區松山路1號' },
    items: [
      { id: 1, name: '有機肥料 A', price: 300, quantity: 2 },
      { id: 2, name: '液體肥料 B', price: 600, quantity: 1 }
    ]
  },
  {
    id: '20240628002',
    date: '2024-06-28',
    status: '處理中',
    total: 450,
    payment: 'cod',
    receiver: { name: '王小明', phone: '0912345678', address: '台北市信義區松山路1號' },
    items: [
      { id: 3, name: '速效化肥 C', price: 450, quantity: 1 }
    ]
  }
]

const order = allOrders.find(o => o.id === route.params.id)
</script> 