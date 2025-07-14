<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>客戶分析</h1>
      <NuxtLink to="/reports" class="btn btn-outline-secondary">返回報表總覽</NuxtLink>
    </div>
    <div class="row mb-4">
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">客戶成長折線圖</div>
          <div class="card-body">
            <LineChart :labels="growthLabels" :datasets="growthDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">客戶等級分布</div>
          <div class="card-body">
            <PieChart :labels="levelLabels" :datasets="levelDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">活躍/非活躍客戶比例</div>
          <div class="card-body">
            <PieChart :labels="activeLabels" :datasets="activeDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">高消費客戶排行榜</div>
          <div class="card-body">
            <ol class="list-group list-group-numbered">
              <li class="list-group-item d-flex justify-content-between align-items-center" v-for="item in topCustomers" :key="item.name">
                <span>{{ item.name }}</span>
                <span class="badge bg-success">${{ item.totalSpent.toLocaleString() }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div class="col-lg-12 mb-4 d-flex align-items-end">
        <div>
          <button class="btn btn-outline-primary me-2">
            <i class="bi bi-download me-2"></i>匯出 Excel
          </button>
          <button class="btn btn-outline-success">
            <i class="bi bi-file-pdf me-2"></i>匯出 PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LineChart from '@/components/LineChart.vue'
import PieChart from '@/components/PieChart.vue'
import { ref } from 'vue'
const growthLabels = ['2月', '3月', '4月', '5月', '6月', '7月']
const growthDatasets = [
  {
    label: '客戶數',
    data: [120, 140, 160, 180, 210, 250],
    borderColor: '#2E8B57',
    backgroundColor: 'rgba(46,139,87,0.1)',
    tension: 0.4,
    fill: true
  }
]
const levelLabels = ['VIP', '一般', '新客戶']
const levelDatasets = [
  {
    label: '人數',
    data: [45, 120, 30],
    backgroundColor: ['#f5bd15', '#2E8B57', '#dc3545']
  }
]
const activeLabels = ['活躍', '非活躍']
const activeDatasets = [
  {
    label: '人數',
    data: [180, 40],
    backgroundColor: ['#2E8B57', '#dc3545']
  }
]
const topCustomers = ref([
  { name: '張小明', totalSpent: 25000 },
  { name: '李美玲', totalSpent: 18000 },
  { name: '王大華', totalSpent: 15000 },
  { name: '陳雅婷', totalSpent: 12000 },
  { name: '林志明', totalSpent: 9000 }
])
</script> 