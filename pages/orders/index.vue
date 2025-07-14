<template>
  <div class="container py-4">
    <h1 class="mb-4">訂單管理</h1>
    <!-- 搜尋區塊 -->
    <div class="card mb-4">
      <div class="card-body">
        <form class="row g-2 align-items-center flex-wrap">
          <div class="col-12 col-md-4">
            <input v-model="search" type="text" class="form-control" placeholder="搜尋訂單編號或訂購人..." />
          </div>
          <div class="col-6 col-md-3">
            <select v-model="statusFilter" class="form-select">
              <option value="">全部狀態</option>
              <option value="待出貨">待出貨</option>
              <option value="已出貨">已出貨</option>
              <option value="已取消">已取消</option>
            </select>
          </div>
          <div class="col-6 col-md-3 d-flex align-items-center">
            <input type="date" v-model="startDate" class="form-control me-2" />
          </div>
            <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-2"></i>清除
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- 表格區塊 -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">訂單列表</h5>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>訂單編號</th>
                <th>訂購人</th>
                <th>金額</th>
                <th>狀態</th>
                <th>下單時間</th>
                <th width="180">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in pagedOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.customer }}</td>
                <td>${{ order.amount }}</td>
                <td>
                  <span :class="['badge',
                    order.status === '待出貨' ? 'bg-warning' :
                    order.status === '已出貨' ? 'bg-success' :
                    'bg-secondary']">
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ order.date }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <NuxtLink :to="`/orders/${order.id}`" class="btn btn-outline-primary">
                      <i class="bi bi-eye"></i>
                    </NuxtLink>
                    <button v-if="order.status === '待出貨'" class="btn btn-outline-warning" @click="shipOrder(order)">
                      <i class="bi bi-truck"></i>
                    </button>
                    <button v-if="order.status === '待出貨'" class="btn btn-outline-danger" @click="cancelOrder(order)">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 分頁 -->
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

// TODO: 之後要串接 API，現在用假資料
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
    return matchKeyword && matchStatus && matchStart
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

function clearFilters() {
  search.value = ''
  statusFilter.value = ''
  startDate.value = ''
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

.pagination .page-link {
  color: var(--color-primary);
}

.pagination .active .page-link {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
</style>

