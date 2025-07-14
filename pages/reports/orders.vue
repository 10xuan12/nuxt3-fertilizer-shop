<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>訂單分析</h1>
      <NuxtLink to="/reports" class="btn btn-outline-secondary">返回報表總覽</NuxtLink>
    </div>
    <div class="row mb-4">
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">訂單數量趨勢圖</div>
          <div class="card-body">
            <LineChart :labels="orderLabels" :datasets="orderDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">平均訂單金額</div>
          <div class="card-body">
            <h3 class="text-success">$1,250</h3>
            <p class="text-muted">本月平均訂單金額</p>
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">各狀態訂單分布</div>
          <div class="card-body">
            <PieChart :labels="statusLabels" :datasets="statusDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">熱門時段分析</div>
          <div class="card-body">
            <BarChart :labels="periodLabels" :datasets="periodDatasets" />
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
import BarChart from '@/components/BarChart.vue'
import PieChart from '@/components/PieChart.vue'

const orderLabels = ['2月', '3月', '4月', '5月', '6月', '7月']
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
const statusLabels = ['已完成', '處理中', '已取消', '待付款']
const statusDatasets = [
  {
    label: '訂單數',
    data: [220, 60, 30, 10],
    backgroundColor: ['#2E8B57', '#f5bd15', '#dc3545', '#17a2b8']
  }
]
const periodLabels = ['08-10', '10-12', '12-14', '14-16', '16-18', '18-20']
const periodDatasets = [
  {
    label: '訂單數',
    data: [20, 35, 50, 40, 30, 25],
    backgroundColor: '#3cb371'
  }
]
</script> 