<template>
  <div class="container py-4">
    <h1 class="mb-4">報表分析</h1>
    
    <!-- 時間篩選 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">開始日期</label>
            <input type="date" class="form-control" v-model="startDate" />
          </div>
          <div class="col-md-3">
            <label class="form-label">結束日期</label>
            <input type="date" class="form-control" v-model="endDate" />
          </div>
          <div class="col-md-3">
            <label class="form-label">報表類型</label>
            <select class="form-select" v-model="reportType">
              <option value="sales">銷售報表</option>
              <option value="products">商品分析</option>
              <option value="customers">客戶分析</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">&nbsp;</label>
            <button class="btn btn-main w-100" @click="generateReport">
              <i class="bi bi-graph-up me-2"></i>生成報表
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 統計卡片 -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="stat-card card">
          <div class="stat-icon bg-primary">
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
          <div class="stat-icon bg-success">
            <i class="bi bi-cart text-white"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalOrders }}</h3>
            <p class="stat-label">總訂單</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card card">
          <div class="stat-icon bg-warning">
            <i class="bi bi-people text-white"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalCustomers }}</h3>
            <p class="stat-label">總客戶</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card card">
          <div class="stat-icon bg-info">
            <i class="bi bi-box text-white"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalProducts }}</h3>
            <p class="stat-label">總商品</p>
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
            <div class="chart-container">
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
              <div v-for="product in topProducts" :key="product.id" class="product-item">
                <div class="product-rank">{{ product.rank }}</div>
                <div class="product-info">
                  <h6 class="product-name">{{ product.name }}</h6>
                  <p class="product-sales">銷售量: {{ product.sales }}</p>
                </div>
                <div class="product-revenue">${{ product.revenue.toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 詳細報表 -->
    <div class="row g-4 mt-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">客戶等級分布</h5>
          </div>
          <div class="card-body">
            <div class="customer-levels">
              <div v-for="level in customerLevels" :key="level.name" class="level-item">
                <div class="level-info">
                  <span class="level-name">{{ level.name }}</span>
                  <span class="level-count">{{ level.count }} 人</span>
                </div>
                <div class="progress">
                  <div class="progress-bar" :style="{ width: level.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">訂單狀態分布</h5>
          </div>
          <div class="card-body">
            <div class="order-status">
              <div v-for="status in orderStatus" :key="status.name" class="status-item">
                <div class="status-info">
                  <span class="status-name">{{ status.name }}</span>
                  <span class="status-count">{{ status.count }} 筆</span>
                </div>
                <div class="progress">
                  <div class="progress-bar" :style="{ width: status.percentage + '%', backgroundColor: status.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 匯出按鈕 -->
    <div class="text-center mt-4">
      <button class="btn btn-outline-primary me-2">
        <i class="bi bi-download me-2"></i>匯出 Excel
      </button>
      <button class="btn btn-outline-success me-2">
        <i class="bi bi-file-pdf me-2"></i>匯出 PDF
      </button>
      <button class="btn btn-outline-info">
        <i class="bi bi-share me-2"></i>分享報表
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 狀態管理
const startDate = ref('2024-01-01')
const endDate = ref('2024-12-31')
const reportType = ref('sales')

// 統計數據
const stats = ref({
  totalRevenue: 1250000,
  totalOrders: 892,
  totalCustomers: 234,
  totalProducts: 156
})

// 銷售數據
const salesData = ref({
  '1月': 65,
  '2月': 78,
  '3月': 82,
  '4月': 75,
  '5月': 90,
  '6月': 85,
  '7月': 88,
  '8月': 92,
  '9月': 87,
  '10月': 95,
  '11月': 89,
  '12月': 93
})

// 熱門商品
const topProducts = ref([
  { id: 1, name: '有機肥料A', sales: 156, revenue: 46800, rank: 1 },
  { id: 2, name: '複合肥料B', sales: 142, revenue: 28400, rank: 2 },
  { id: 3, name: '速效肥料C', sales: 98, revenue: 39200, rank: 3 },
  { id: 4, name: '液態肥料D', sales: 87, revenue: 26100, rank: 4 },
  { id: 5, name: '緩釋肥料E', sales: 76, revenue: 22800, rank: 5 }
])

// 客戶等級分布
const customerLevels = ref([
  { name: 'VIP', count: 45, percentage: 19 },
  { name: '一般', count: 156, percentage: 67 },
  { name: '新客戶', count: 33, percentage: 14 }
])

// 訂單狀態分布
const orderStatus = ref([
  { name: '已完成', count: 623, percentage: 70, color: 'var(--color-success)' },
  { name: '處理中', count: 156, percentage: 17, color: 'var(--color-warning)' },
  { name: '已取消', count: 89, percentage: 10, color: 'var(--color-danger)' },
  { name: '待付款', count: 24, percentage: 3, color: 'var(--color-info)' }
])

function generateReport() {
  console.log('生成報表:', { startDate: startDate.value, endDate: endDate.value, reportType: reportType.value })
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

.chart-container {
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

.product-rank {
  width: 30px;
  height: 30px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
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

.product-revenue {
  font-weight: 600;
  color: var(--color-success);
  font-size: 0.9rem;
}

.customer-levels, .order-status {
  max-height: 200px;
  overflow-y: auto;
}

.level-item, .status-item {
  margin-bottom: var(--spacing-sm);
}

.level-info, .status-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.level-name, .status-name {
  font-size: 0.9rem;
  color: var(--color-text);
}

.level-count, .status-count {
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.progress {
  height: 0.5rem;
  border-radius: var(--border-radius-sm);
  background: var(--color-border);
}

.progress-bar {
  background: var(--color-primary);
  border-radius: var(--border-radius-sm);
}

@media (max-width: 768px) {
  .stat-card {
    margin-bottom: var(--spacing-sm);
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .chart-container {
    height: 200px;
  }
}
</style> 