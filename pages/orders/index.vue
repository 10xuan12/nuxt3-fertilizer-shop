<template>
  <div class="container py-4">
    <h1 class="mb-4">訂單管理</h1>
    <div class="row g-2 mb-3 align-items-end">
      <div class="col-md-3">
        <label class="form-label mb-1">搜尋訂單編號或訂購人</label>
        <input v-model="search" type="text" class="form-control" placeholder="請輸入關鍵字..." />
      </div>
      <div class="col-md-2">
        <label class="form-label mb-1">訂單狀態</label>
        <select v-model="statusFilter" class="form-select">
          <option value="">全部</option>
          <option value="待出貨">待出貨</option>
          <option value="已出貨">已出貨</option>
          <option value="已取消">已取消</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label mb-1">開始日期</label>
        <input v-model="startDate" type="date" class="form-control" />
      </div>
      <div class="col-md-3">
        <label class="form-label mb-1">結束日期</label>
        <input v-model="endDate" type="date" class="form-control" />
      </div>
    </div>
    <div class="table-responsive">
      <table class="table align-middle table-hover order-table">
        <thead>
          <tr>
            <th scope="col">訂單編號</th>
            <th scope="col">訂購人</th>
            <th scope="col">金額</th>
            <th scope="col">狀態</th>
            <th scope="col">下單時間</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in pagedOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>${{ order.amount }}</td>
            <td>
              <span :class="['badge',
                order.status === '待出貨' ? 'bg-warning text-dark' :
                order.status === '已出貨' ? 'bg-success' :
                'bg-secondary']">
                {{ order.status }}
              </span>
            </td>
            <td>{{ order.date }}</td>
            <td>
              <NuxtLink :to="`/orders/${order.id}`" class="btn btn-main btn-sm me-1"><span class="me-1">🔍</span>查看</NuxtLink>
              <button v-if="order.status === '待出貨'" class="btn btn-outline-success btn-sm me-1" @click="shipOrder(order)"><span class="me-1">🚚</span>出貨</button>
              <button v-if="order.status === '待出貨'" class="btn btn-outline-danger btn-sm" @click="cancelOrder(order)"><span class="me-1">✖️</span>取消</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav v-if="totalPages > 1" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{disabled: currentPage === 1}">
          <button class="page-link" @click="goPage(currentPage - 1)" :disabled="currentPage === 1">上一頁</button>
        </li>
        <li v-for="n in totalPages" :key="n" class="page-item" :class="{active: n === currentPage}">
          <button class="page-link" @click="goPage(n)">{{ n }}</button>
        </li>
        <li class="page-item" :class="{disabled: currentPage === totalPages}">
          <button class="page-link" @click="goPage(currentPage + 1)" :disabled="currentPage === totalPages">下一頁</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Order {
  id: string
  customer: string
  amount: number
  status: '待出貨' | '已出貨' | '已取消'
  date: string // yyyy-MM-dd HH:mm
}

const orders = ref<Order[]>([
  { id: '20240601001', customer: '王小明', amount: 1200, status: '待出貨', date: '2024-06-01 10:23' },
  { id: '20240601002', customer: '李小美', amount: 850, status: '已出貨', date: '2024-06-01 11:05' },
  { id: '20240601003', customer: '陳大華', amount: 420, status: '已取消', date: '2024-06-01 12:10' },
  { id: '20240601004', customer: '林小芳', amount: 1999, status: '待出貨', date: '2024-06-01 13:45' },
  { id: '20240601005', customer: '張大仁', amount: 650, status: '待出貨', date: '2024-06-02 09:10' },
  { id: '20240601006', customer: '黃小美', amount: 780, status: '已出貨', date: '2024-06-02 10:30' },
  { id: '20240601007', customer: '林志明', amount: 320, status: '已取消', date: '2024-06-02 11:20' },
  { id: '20240601008', customer: '陳小芳', amount: 2100, status: '待出貨', date: '2024-06-02 12:45' },
  { id: '20240601009', customer: '李大華', amount: 990, status: '已出貨', date: '2024-06-02 13:55' },
  { id: '20240601010', customer: '王小美', amount: 1500, status: '待出貨', date: '2024-06-03 08:30' },
])

const search = ref('')
const statusFilter = ref('')
const startDate = ref('')
const endDate = ref('')

const currentPage = ref(1)
const pageSize = 5

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchKeyword =
      order.id.includes(search.value) ||
      order.customer.includes(search.value)
    const matchStatus =
      !statusFilter.value || order.status === statusFilter.value
    const orderDate = order.date.slice(0, 10)
    const matchStart = !startDate.value || orderDate >= startDate.value
    const matchEnd = !endDate.value || orderDate <= endDate.value
    return matchKeyword && matchStatus && matchStart && matchEnd
  })
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize))
const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

function goPage(n: number) {
  if (n < 1 || n > totalPages.value) return
  currentPage.value = n
}

function shipOrder(order: Order) {
  order.status = '已出貨'
}

function cancelOrder(order: Order) {
  order.status = '已取消'
}
</script>

<style scoped>
.order-table {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 16px 0 rgba(44, 62, 80, 0.08);
  background: var(--color-bg);
}
.order-table thead {
  background: var(--color-primary);
  color: #fff;
}
.order-table tbody tr:hover {
  background: var(--color-secondary);
}
.btn-main {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  box-shadow: 0 1px 4px 0 rgba(44, 62, 80, 0.08);
  transition: background 0.18s;
}
.btn-main:hover, .btn-main:focus {
  background: #256b45;
  color: #fff;
}
.pagination .page-link {
  color: var(--color-primary);
}
.pagination .active .page-link {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
</style>

