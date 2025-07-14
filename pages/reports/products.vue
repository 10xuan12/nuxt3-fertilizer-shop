<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>商品分析</h1>
      <NuxtLink to="/reports" class="btn btn-outline-secondary">返回報表總覽</NuxtLink>
    </div>
    <div class="row mb-4">
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">商品銷售排行</div>
          <div class="card-body">
            <BarChart :labels="productLabels" :datasets="productDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="card h-100">
          <div class="card-header">分類銷售分布</div>
          <div class="card-body">
            <PieChart :labels="categoryLabels" :datasets="categoryDatasets" />
          </div>
        </div>
      </div>
      <div class="col-lg-12 mb-4">
        <div class="card h-100">
          <div class="card-header">庫存預警商品</div>
          <div class="card-body p-0">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th>分類</th>
                  <th>庫存數量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in lowStockProducts" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.category }}</td>
                  <td><span class="badge bg-danger">{{ item.stock }}</span></td>
                </tr>
              </tbody>
            </table>
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
import BarChart from '@/components/BarChart.vue'
import PieChart from '@/components/PieChart.vue'
import { ref } from 'vue'
const productLabels = ['有機肥A', '複合肥B', '液體肥C', '速效肥D', '緩釋肥E']
const productDatasets = [
  {
    label: '銷售數量',
    data: [120, 98, 75, 60, 45],
    backgroundColor: '#3cb371'
  }
]
const categoryLabels = ['有機肥', '複合肥', '液體肥', '速效肥']
const categoryDatasets = [
  {
    label: '分類銷售',
    data: [350, 280, 180, 120],
    backgroundColor: ['#3cb371', '#f5bd15', '#17a2b8', '#dc3545']
  }
]
const lowStockProducts = ref([
  { name: '有機肥A', category: '有機肥', stock: 5 },
  { name: '複合肥B', category: '複合肥', stock: 8 },
  { name: '液體肥C', category: '液體肥', stock: 3 }
])
</script> 