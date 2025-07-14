<template>
  <div class="container py-4">
    <!-- 頁面標題和操作按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>新增客戶</h1>
        <p class="text-muted mb-0">建立新的客戶資料</p>
      </div>
      <button class="btn btn-secondary" @click="goBack">
        <i class="bi bi-arrow-left me-2"></i>返回
      </button>
    </div>

    <!-- 新增客戶表單 -->
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-person-plus me-2"></i>客戶資料
            </h5>
          </div>
          <div class="card-body">
            <CustomerFormModal
              :show="true"
              :customer="null"
              mode="add"
              @save="handleSave"
              @close="goBack"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import CustomerFormModal from '../../components/CustomerFormModal.vue'

interface Customer {
  name: string
  phone: string
  email: string
  level: string
  status: string
  orderCount: number
  totalSpent: number
  createdAt: string
  notes?: string
}

const router = useRouter()

function handleSave(data: Customer) {
  // TODO: 串接API，這裡先直接導回列表
  console.log('新增客戶資料:', data)
  router.push('/customers')
}

function goBack() {
  router.push('/customers')
}
</script>

<style scoped>
.card-header h5 {
  margin-bottom: 0;
  font-weight: 600;
}
</style> 