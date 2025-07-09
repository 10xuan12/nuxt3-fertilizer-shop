<template>
  <div class="container py-4">
    <h1 class="mb-4">主頁</h1>
    
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
          <div class="stat-icon bg-info">
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
                <button class="btn btn-outline-info w-100" @click="exportData">
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
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">銷售趨勢</h5>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div v-for="(value, month) in salesData" :key="month" class="chart-bar">
                  <div class="bar" :style="{ height: value + '%' }"></div>
                  <span class="bar-label">{{ month }}</span>
                </div>
              </div>
            </div>
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
import { ref } from 'vue'

const stats = ref({
  totalProducts: 156,
  totalOrders: 892,
  totalRevenue: 1250000,
  totalCustomers: 234
})

const recentActivities = ref([
  { id: 1, type: 'success', icon: 'bi bi-check-circle', text: '新訂單 #20240601011 已確認', time: '2 分鐘前' },
  { id: 2, type: 'info', icon: 'bi bi-plus-circle', text: '新增商品「有機肥料D」', time: '15 分鐘前' },
  { id: 3, type: 'warning', icon: 'bi bi-exclamation-triangle', text: '庫存不足警告：速效肥料C', time: '1 小時前' },
  { id: 4, type: 'primary', icon: 'bi bi-person-plus', text: '新客戶註冊：張小明', time: '2 小時前' }
])

const salesData = ref({
  '1月': 65,
  '2月': 78,
  '3月': 82,
  '4月': 75,
  '5月': 90,
  '6月': 85
})

const popularProducts = ref([
  { id: 1, name: '有機肥料A', sales: 156, image: '/placeholder-images-image_large.webp' },
  { id: 2, name: '複合肥料B', sales: 142, image: '/placeholder-images-image_large.webp' },
  { id: 3, name: '速效肥料C', sales: 98, image: '/placeholder-images-image_large.webp' }
])

function exportData() {
  // 匯出報表功能
  console.log('匯出報表')
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
.activity-icon.info { background: var(--color-info); color: white; }
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
