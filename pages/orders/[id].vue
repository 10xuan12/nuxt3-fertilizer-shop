<template>
  <div class="container py-4">
    <button class="btn btn-outline-secondary mb-3" @click="goBack">← 返回訂單列表</button>
    <div v-if="order" class="order-detail-card mx-auto">
      <h2 class="mb-3">訂單詳情</h2>
      <div class="row mb-2">
        <div class="col-6"><strong>訂單編號：</strong>{{ order.id }}</div>
        <div class="col-6"><strong>下單時間：</strong>{{ order.date }}</div>
      </div>
      <div class="row mb-2">
        <div class="col-6"><strong>訂購人：</strong>{{ order.customer }}</div>
        <div class="col-6"><strong>狀態：</strong>
          <span :class="['badge',
            order.status === '待出貨' ? 'bg-warning text-dark' :
            order.status === '已出貨' ? 'bg-success' :
            'bg-secondary']">
            {{ order.status }}
          </span>
        </div>
      </div>
      <div class="mb-2"><strong>收件人：</strong>{{ order.receiver }}</div>
      <div class="mb-2"><strong>收件地址：</strong>{{ order.address }}</div>
      <div class="mb-2"><strong>聯絡電話：</strong>{{ order.phone }}</div>
      <div class="mb-2"><strong>訂單備註：</strong>{{ order.note || '—' }}</div>
      <div class="mb-3" v-if="order.status === '待出貨'">
        <button class="btn btn-success me-2" @click="shipOrder">出貨</button>
        <button class="btn btn-danger" @click="cancelOrder">取消訂單</button>
      </div>
      <hr />
      <h5 class="mb-2">商品明細</h5>
      <table class="table table-bordered align-middle">
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>數量</th>
            <th>單價</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.name">
            <td>
              <NuxtLink :to="`/products/${item.id || item.name}`" class="text-decoration-underline">
                {{ item.name }}
              </NuxtLink>
            </td>
            <td>{{ item.qty }}</td>
            <td>${{ item.price }}</td>
            <td>${{ item.qty * item.price }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-end fs-5 fw-bold">總金額：${{ order.amount }}</div>
    </div>
    <div v-else class="alert alert-danger">查無此訂單</div>
  </div>

</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

// TODO: 之後要串接後端 API，現在用假資料
const orders = [
  {
    id: '20240601001', customer: '王小明', amount: 1200, status: '待出貨', date: '2024-06-01 10:23',
    receiver: '王小明', address: '台北市信義區松山路1號', phone: '0912345678',
    note: '請盡快出貨',
    items: [
      { id: 'A', name: '有機肥料A', qty: 2, price: 500 },
      { id: 'B', name: '複合肥料B', qty: 1, price: 200 }
    ]
  },
  {
    id: '20240601002', customer: '李小美', amount: 850, status: '已出貨', date: '2024-06-01 11:05',
    receiver: '李小美', address: '新北市板橋區文化路2號', phone: '0922333444',
    note: '',
    items: [
      { id: 'C', name: '速效肥料C', qty: 1, price: 420 },
      { id: 'A', name: '有機肥料A', qty: 1, price: 430 }
    ]
  }
]

const order = ref(orders.find(o => o.id === route.params.id))

function goBack() {
  router.push('/orders')
}

function shipOrder() {
  // TODO: 串接API，將訂單狀態設為已出貨
  if (order.value) order.value.status = '已出貨'
}
function cancelOrder() {
  // TODO: 串接API，將訂單狀態設為已取消
  if (order.value) order.value.status = '已取消'
}
</script>

<style scoped>
.order-detail-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(44, 62, 80, 0.08);
  padding: 2.5rem 2rem;
  max-width: 600px;
}
</style> 