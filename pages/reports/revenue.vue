<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>營收分析</h1>
      <NuxtLink to="/reports" class="btn btn-outline-secondary">返回報表總覽</NuxtLink>
    </div>
    <div class="row mb-4">
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">月營收折線圖</div>
          <div class="card-body">
            <LineChart :labels="monthLabels" :datasets="monthRevenueDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">年度營收長條圖</div>
          <div class="card-body">
            <BarChart :labels="yearLabels" :datasets="yearRevenueDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">分類營收圓餅圖</div>
          <div class="card-body">
            <PieChart :labels="categoryLabels" :datasets="categoryDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4 d-flex align-items-end">
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

const monthLabels = ['2月', '3月', '4月', '5月', '6月', '7月']
const monthRevenueDatasets = [
  {
    label: '月營收',
    data: [80000, 95000, 110000, 105000, 120000, 125000],
    borderColor: '#2E8B57',
    backgroundColor: 'rgba(46,139,87,0.1)',
    tension: 0.4,
    fill: true
  }
]
const yearLabels = ['2020', '2021', '2022', '2023', '2024']
const yearRevenueDatasets = [
  {
    label: '年度營收',
    data: [800000, 950000, 1100000, 1200000, 1250000],
    backgroundColor: '#2E8B57'
  }
]
const categoryLabels = ['有機肥', '複合肥', '液體肥', '速效肥']
const categoryDatasets = [
  {
    label: '分類營收',
    data: [350000, 280000, 180000, 120000],
    backgroundColor: ['#3cb371', '#f5bd15', '#17a2b8', '#dc3545']
  }
]
</script> 