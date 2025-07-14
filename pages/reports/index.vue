<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>報表分析</h1>
      <div class="btn-group">
        <NuxtLink to="/reports/revenue" class="btn btn-outline-primary">營收分析</NuxtLink>
        <NuxtLink to="/reports/orders" class="btn btn-outline-primary">訂單分析</NuxtLink>
        <NuxtLink to="/reports/customers" class="btn btn-outline-primary">客戶分析</NuxtLink>
        <NuxtLink to="/reports/products" class="btn btn-outline-primary">商品分析</NuxtLink>
      </div>
    </div>

    <!-- 營運總覽卡片 -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <div class="text-muted">本月營收</div>
            <h3 class="text-success">$120,000</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <div class="text-muted">本月訂單數</div>
            <h3 class="text-primary">320</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <div class="text-muted">本月新客戶</div>
            <h3 class="text-danger">45</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <div class="text-muted">商品總數</div>
            <h3 class="text-warning">120</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖表區塊 -->
    <div class="row mb-4">
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">近六個月營收</div>
          <div class="card-body">
            <LineChart :labels="revenueLabels" :datasets="revenueDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">近六個月訂單數</div>
          <div class="card-body">
            <LineChart :labels="orderLabels" :datasets="orderDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">熱門商品排行榜</div>
          <div class="card-body">
            <ol class="list-group list-group-numbered">
              <li class="list-group-item d-flex justify-content-between align-items-center" v-for="item in topProducts" :key="item.name">
                <span>{{ item.name }}</span>
                <span class="badge bg-success">{{ item.sales }} 件</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">客戶等級分布</div>
          <div class="card-body">
            <PieChart :labels="customerLevelLabels" :datasets="customerLevelDatasets" />
          </div>
        </div>
      </div>
    </div>

    <!-- 近期新客戶列表 -->
    <div class="card mb-4">
      <div class="card-header">近期新客戶</div>
      <div class="card-body p-0">
        <table class="table mb-0">
          <thead>
            <tr>
              <th>姓名</th>
              <th>電話</th>
              <th>Email</th>
              <th>註冊日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in newCustomers" :key="c.email">
              <td>{{ c.name }}</td>
              <td>{{ c.phone }}</td>
              <td>{{ c.email }}</td>
              <td>{{ c.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LineChart from '@/components/LineChart.vue'
import PieChart from '@/components/PieChart.vue'

const revenueLabels = ['2月', '3月', '4月', '5月', '6月', '7月']
const revenueDatasets = [
  {
    label: '營收',
    data: [80000, 95000, 110000, 105000, 120000, 125000],
    borderColor: '#2E8B57',
    backgroundColor: 'rgba(46,139,87,0.1)',
    tension: 0.4,
    fill: true
  }
]
const orderLabels = revenueLabels
const orderDatasets = [
  {
    label: '訂單數',
    data: [210, 250, 270, 260, 300, 320],
    borderColor: '#256b45',
    backgroundColor: 'rgba(37,107,69,0.1)',
    tension: 0.4,
    fill: true
  }
]
const customerLevelLabels = ['VIP', '一般', '新客戶']
const customerLevelDatasets = [
  {
    label: '人數',
    data: [45, 120, 30],
    backgroundColor: ['#f5bd15', '#2E8B57', '#dc3545']
  }
]
const topProducts = ref([
  { name: '有機肥A', sales: 120 },
  { name: '複合肥B', sales: 98 },
  { name: '液體肥C', sales: 75 },
  { name: '速效肥D', sales: 60 },
  { name: '緩釋肥E', sales: 45 }
])
const newCustomers = ref([
  { name: '張小明', phone: '0912-345-678', email: 'zhang@example.com', createdAt: '2024-07-01' },
  { name: '李美玲', phone: '0923-456-789', email: 'li@example.com', createdAt: '2024-07-03' },
  { name: '王大華', phone: '0934-567-890', email: 'wang@example.com', createdAt: '2024-07-05' },
  { name: '陳雅婷', phone: '0945-678-901', email: 'chen@example.com', createdAt: '2024-07-08' }
])
</script>

<style scoped>
.card-header {
  font-weight: 600;
  background: #f8f9fa;
}
</style> 