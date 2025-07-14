<template>
  <div class="container py-4">
    <h1 class="mb-4">主頁</h1>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
    </div>

    <div v-else-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>
    
    <!-- 統計卡片 -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="stat-card card">
          <div class="stat-icon bg-primary">
            <i class="bi bi-box text-white"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalProducts }}</h3>
            <p class="stat-label">商品總數</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card card">
          <div class="stat-icon bg-success">
            <i class="bi bi-cart text-white"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalOrders }}</h3>
            <p class="stat-label">訂單總數</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card card">
          <div class="stat-icon bg-warning">
            <i class="bi bi-currency-dollar text-white"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">${{ stats.totalRevenue.toLocaleString() }}</h3>
            <p class="stat-label">總營收</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card card">
          <div class="stat-icon bg-danger">
            <i class="bi bi-people text-white"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalCustomers }}</h3>
            <p class="stat-label">客戶總數</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">快速操作</h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-6">
                <NuxtLink to="/products/create" class="btn btn-main w-100">
                  <i class="bi bi-plus-circle me-2"></i>新增商品
                </NuxtLink>
              </div>
              <div class="col-6">
                <NuxtLink to="/categories/create" class="btn btn-outline-primary w-100">
                  <i class="bi bi-folder-plus me-2"></i>新增分類
                </NuxtLink>
              </div>
              <div class="col-6">
                <NuxtLink to="/orders" class="btn btn-outline-success w-100">
                  <i class="bi bi-list-ul me-2"></i>查看訂單
                </NuxtLink>
              </div>
              <div class="col-6">
                <button class="btn btn-outline-danger w-100" @click="exportData">
                  <i class="bi bi-download me-2"></i>匯出報表
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">最近活動</h5>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-content">
                  <p class="activity-text">{{ activity.text }}</p>
                  <small class="activity-time">{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="row g-4">
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-header">近六個月營收</div>
          <div class="card-body">
            <LineChart :labels="revenueLabels" :datasets="revenueDatasets" />
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">熱門商品</h5>
          </div>
          <div class="card-body">
            <div class="popular-products">
              <div v-for="product in popularProducts" :key="product.id" class="product-item">
                <img :src="product.image" :alt="product.name" class="product-img" />
                <div class="product-info">
                  <h6 class="product-name">{{ product.name }}</h6>
                  <p class="product-sales">銷售量: {{ product.sales }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import axios from 'axios' // 移除全域 import
import LineChart from '@/components/LineChart.vue'

const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  totalCustomers: 0
})

interface Activity {
  id: number | string
  type: string
  icon: string
  text: string
  time: string
}
const recentActivities = ref<Activity[]>([])
const salesData = ref({})
interface Product {
  id: number | string
  name: string
  image: string
  sales: number
}
const popularProducts = ref<Product[]>([])

const loading = ref(true)
const errorMsg = ref('')

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

async function fetchDashboard() {
  loading.value = true
  errorMsg.value = ''
  try {
    // 僅在 client 端才載入 axios 並呼叫
    if (process.client) {
      const axios = (await import('axios')).default
      // 這裡可以寫 axios 實際呼叫 API 的程式碼
      // 例如：const { data } = await axios.get('/api/dashboard')
      // 目前用假資料
    }
    // 假資料
    stats.value = {
      totalProducts: 120,
      totalOrders: 340,
      totalRevenue: 1250000,
      totalCustomers: 85
    }
    recentActivities.value = [
      { id: 1, type: 'success', icon: 'bi bi-check-circle', text: '王小明 剛剛下單了 3 項商品', time: '1 分鐘前' },
      { id: 2, type: 'danger', icon: 'bi bi-person-plus', text: '新客戶 李小美 註冊成功', time: '5 分鐘前' },
      { id: 3, type: 'warning', icon: 'bi bi-exclamation-triangle', text: '商品「有機肥料A」庫存低於 10 件', time: '10 分鐘前' },
      { id: 4, type: 'primary', icon: 'bi bi-box', text: '新商品「速效肥料C」已上架', time: '30 分鐘前' }
    ]
    salesData.value = {
      '1月': 30,
      '2月': 40,
      '3月': 60,
      '4月': 80,
      '5月': 70,
      '6月': 90
    }
    popularProducts.value = [
      { id: 1, name: '有機肥料A', image: '/placeholder-images-image_large.webp', sales: 120 },
      { id: 2, name: '複合肥料B', image: '/placeholder-images-image_large.webp', sales: 95 },
      { id: 3, name: '速效肥料C', image: '/placeholder-images-image_large.webp', sales: 80 }
    ]
  } catch (error) {
    errorMsg.value = '無法取得資料，請稍後再試。'
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})

function exportData() {
  // Example: Export stats as JSON file
  const dataStr = JSON.stringify({
    stats: stats.value,
    recentActivities: recentActivities.value,
    salesData: salesData.value,
    popularProducts: popularProducts.value
  }, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'dashboard-report.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>


<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  padding: var(--spacing);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing);
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
}

.stat-label {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
  font-size: 1rem;
}

.activity-icon.success { background: var(--color-success); color: white; }
.activity-icon.danger{ background: var(--color-info); color: white; }
.activity-icon.warning { background: var(--color-warning); color: white; }
.activity-icon.primary { background: var(--color-primary); color: white; }

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text);
}

.activity-time {
  color: var(--color-text-light);
  font-size: 0.8rem;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: end;
  justify-content: space-around;
  padding: var(--spacing);
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
}

.bar {
  width: 30px;
  background: var(--color-primary);
  border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
  transition: all 0.3s ease;
}

.bar:hover {
  background: var(--color-primary-dark);
  transform: scaleY(1.1);
}

.bar-label {
  margin-top: var(--spacing-xs);
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.popular-products {
  max-height: 300px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
}

.product-item:last-child {
  border-bottom: none;
}

.product-img {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-sm);
  object-fit: cover;
  margin-right: var(--spacing-sm);
}

.product-info {
  flex: 1;
}

.product-name {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text);
}

.product-sales {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .stat-card {
    margin-bottom: var(--spacing-sm);
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .chart-placeholder {
    height: 200px;
  }
}
</style>
