<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">結帳</h1>
    <form @submit.prevent="nextStep" class="bg-white rounded shadow p-6 mb-8">
      <!-- 步驟指示器 -->
      <div class="flex justify-between mb-8">
        <div v-for="(label, idx) in steps" :key="idx" class="flex-1 flex flex-col items-center">
          <div :class="['w-8 h-8 flex items-center justify-center rounded-full mb-1', step === idx ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500']">
            {{ idx + 1 }}
          </div>
          <span :class="step === idx ? 'text-green-600 font-bold' : 'text-gray-500'">{{ label }}</span>
        </div>
      </div>
      <!-- 步驟一：收件人資訊 -->
      <div v-if="step === 0">
        <h2 class="text-xl font-semibold mb-4">收件人資訊</h2>
        <div class="mb-4">
          <label class="block mb-1 font-medium">姓名</label>
          <input v-model="form.name" type="text" required class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-300" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">電話</label>
          <input v-model="form.phone" type="tel" required class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-300" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">地址</label>
          <input v-model="form.address" type="text" required class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-300" />
        </div>
      </div>
      <!-- 步驟二：付款方式 -->
      <div v-if="step === 1">
        <h2 class="text-xl font-semibold mb-4">付款方式</h2>
        <div class="mb-4">
          <label class="inline-flex items-center mr-6">
            <input type="radio" v-model="form.payment" value="credit" class="mr-2" />
            信用卡
          </label>
          <label class="inline-flex items-center">
            <input type="radio" v-model="form.payment" value="cod" class="mr-2" />
            貨到付款
          </label>
        </div>
        <div v-if="form.payment === 'credit'" class="space-y-4">
          <div>
            <label class="block mb-1 font-medium">信用卡號</label>
            <input v-model="form.cardNumber" type="text" maxlength="19" placeholder="xxxx-xxxx-xxxx-xxxx" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-300" />
          </div>
          <div class="flex space-x-4">
            <div class="flex-1">
              <label class="block mb-1 font-medium">有效月年</label>
              <input v-model="form.cardExp" type="text" maxlength="5" placeholder="MM/YY" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-300" />
            </div>
            <div class="flex-1">
              <label class="block mb-1 font-medium">安全碼</label>
              <input v-model="form.cardCVC" type="text" maxlength="4" placeholder="CVC" class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-300" />
            </div>
          </div>
        </div>
      </div>
      <!-- 步驟三：訂單確認 -->
      <div v-if="step === 2">
        <h2 class="text-xl font-semibold mb-4">訂單確認</h2>
        <div class="mb-2 text-gray-700">收件人：{{ form.name }} / {{ form.phone }}</div>
        <div class="mb-2 text-gray-700">地址：{{ form.address }}</div>
        <div class="mb-2 text-gray-700">付款方式：{{ paymentText }}</div>
        <div v-if="form.payment === 'credit'" class="mb-2 text-gray-700">信用卡：****-****-****-{{ form.cardNumber.slice(-4) }}</div>
        <div class="border-b my-4"></div>
        <div v-for="item in cart" :key="item.id" class="flex justify-between items-center mb-2">
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span>NT$ {{ item.price * item.quantity }}</span>
        </div>
        <div class="flex justify-between items-center font-bold text-lg mt-4">
          <span>總計</span>
          <span>NT$ {{ total }}</span>
        </div>
      </div>
      <!-- 步驟按鈕 -->
      <div class="flex justify-between mt-8">
        <button
          v-if="step > 0"
          type="button"
          @click="prevStep"
          class="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all"
        >
          上一步
        </button>
        <button
          v-if="step < 2"
          type="submit"
          class="ml-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-200 focus:ring-2 focus:ring-green-300 active:scale-95"
        >
          下一步
        </button>
        <button
          v-if="step === 2"
          type="button"
          @click="submitOrder"
          class="ml-auto px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-all duration-200 focus:ring-2 focus:ring-yellow-300 active:scale-95"
        >
          送出訂單
        </button>
      </div>
    </form>
    <!-- 訂單完成彈窗 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
        <div class="text-green-600 text-4xl mb-4">✔</div>
        <div class="text-xl font-bold mb-2">訂單已完成！</div>
        <div class="text-gray-700 mb-6">感謝您的購買，我們將盡快為您出貨。</div>
        <NuxtLink to="/" class="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all">回首頁</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '../store/cart'
import { useNuxtApp } from 'nuxt/app'
const cartStore = useCartStore()
const nuxtApp = useNuxtApp()
const $toast = nuxtApp.$toast

const steps = ['收件人', '付款方式', '訂單確認']
const step = ref(0)
const showModal = ref(false)

const form = ref({
  name: '',
  phone: '',
  address: '',
  payment: '',
  cardNumber: '',
  cardExp: '',
  cardCVC: ''
})

const cart = cartStore.cart
const total = cartStore.totalPrice

const paymentText = computed(() => {
  if (form.value.payment === 'credit') return '信用卡'
  if (form.value.payment === 'cod') return '貨到付款'
  return ''
})

function nextStep() {
  if (step.value === 0) {
    if (!form.value.name || !form.value.phone || !form.value.address) {
      ($toast as any).error('請完整填寫收件人資訊')
      return
    }
  }
  if (step.value === 1) {
    if (!form.value.payment) {
      ($toast as any).error('請選擇付款方式')
      return
    }
    if (form.value.payment === 'credit') {
      if (!form.value.cardNumber || !form.value.cardExp || !form.value.cardCVC) {
        ($toast as any).error('請完整填寫信用卡資訊')
        return
      }
    }
  }
  step.value++
}

function prevStep() {
  if (step.value > 0) step.value--
}

function submitOrder() {
  if (cart.length === 0) {
    ($toast as any).error('購物車是空的')
    return
  }
  showModal.value = true
  cartStore.clearCart()
  form.value = { name: '', phone: '', address: '', payment: '', cardNumber: '', cardExp: '', cardCVC: '' }
  step.value = 0
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease;
}
</style> 