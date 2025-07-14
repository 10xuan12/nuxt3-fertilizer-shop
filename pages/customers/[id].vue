<template>
  <div class="container py-4">
    <!-- 頁面標題和操作按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>客戶詳情</h1>
        <p class="text-muted mb-0">客戶 ID: {{ customer?.id }}</p>
      </div>
      <div class="btn-group">
        <button class="btn btn-outline-primary" @click="isEditing = true" v-if="!isEditing">
          <i class="bi bi-pencil me-2"></i>編輯
        </button>
        <button class="btn btn-outline-danger" @click="handleDelete" v-if="!isEditing">
          <i class="bi bi-trash me-2"></i>刪除
        </button>
        <button class="btn btn-secondary" @click="goBack">
          <i class="bi bi-arrow-left me-2"></i>返回
        </button>
      </div>
    </div>

    <!-- 客戶詳細資訊 -->
    <div v-if="customer && !isEditing" class="row">
      <!-- 基本資訊卡片 -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-person-circle me-2"></i>基本資訊
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label text-muted">姓名</label>
                <p class="mb-0 fw-bold">{{ customer.name }}</p>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label text-muted">客戶等級</label>
                <p class="mb-0">
                  <span :class="getLevelBadge(customer.level)">
                    {{ getLevelText(customer.level) }}
                  </span>
                </p>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label text-muted">電話</label>
                <p class="mb-0">
                  <i class="bi bi-telephone me-1"></i>{{ customer.phone }}
                </p>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label text-muted">Email</label>
                <p class="mb-0">
                  <i class="bi bi-envelope me-1"></i>{{ customer.email }}
                </p>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label text-muted">狀態</label>
                <p class="mb-0">
                  <span :class="getStatusBadge(customer.status)">
                    {{ customer.status === 'active' ? '活躍' : '非活躍' }}
                  </span>
                </p>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label text-muted">註冊時間</label>
                <p class="mb-0">{{ formatDate(customer.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 統計資訊卡片 -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-graph-up me-2"></i>統計資訊
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6 mb-3">
                <div class="text-center">
                  <h3 class="text-primary mb-1">{{ customer.orderCount }}</h3>
                  <p class="text-muted mb-0">總訂單數</p>
                </div>
              </div>
              <div class="col-6 mb-3">
                <div class="text-center">
                  <h3 class="text-success mb-1">${{ customer.totalSpent.toLocaleString() }}</h3>
                  <p class="text-muted mb-0">總消費金額</p>
                </div>
              </div>
              <div class="col-6 mb-3">
                <div class="text-center">
                  <h3 class="text-warning mb-1">${{ averageOrderValue }}</h3>
                  <p class="text-muted mb-0">平均訂單金額</p>
                </div>
              </div>
              <div class="col-6 mb-3">
                <div class="text-center">
                  <h3 class="text-danger mb-1">{{ daysSinceRegistration }}</h3>
                  <p class="text-muted mb-0">註冊天數</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近訂單 -->
      <div class="col-12 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-list-ul me-2"></i>最近訂單
            </h5>
          </div>
          <div class="card-body">
            <div v-if="recentOrders.length === 0" class="text-center py-4">
              <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
              <p class="text-muted mt-3">暫無訂單記錄</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>訂單編號</th>
                    <th>訂單日期</th>
                    <th>商品數量</th>
                    <th>訂單金額</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ formatDate(order.date) }}</td>
                    <td>{{ order.itemCount }}</td>
                    <td>${{ order.amount.toLocaleString() }}</td>
                    <td>
                      <span :class="getOrderStatusBadge(order.status)">
                        {{ getOrderStatusText(order.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 備註資訊 -->
      <div class="col-12 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-chat-text me-2"></i>備註
            </h5>
          </div>
          <div class="card-body">
            <p v-if="!customer.notes" class="text-muted mb-0">暫無備註</p>
            <p v-else class="mb-0">{{ customer.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯表單 -->
    <CustomerFormModal
      v-if="isEditing"
      :show="true"
      :customer="customer"
      mode="edit"
      @save="handleSave"
      @close="isEditing = false"
    />

    <!-- 刪除確認彈窗 -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="確認刪除客戶"
      message="您確定要刪除這個客戶嗎？此操作無法復原。"
      :details="customer ? `客戶姓名：${customer.name}` : ''"
      type="delete"
      confirm-text="確認刪除"
      @confirm="confirmDelete"
      @close="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CustomerFormModal from '../../components/CustomerFormModal.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'

interface Customer {
  id: number
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

interface Order {
  id: string
  date: string
  itemCount: number
  amount: number
  status: string
}

const router = useRouter()
const route = useRoute()
const isEditing = ref(false)
const showDeleteConfirm = ref(false)

// TODO: 之後要串接 API，現在用假資料
const customer = ref<Customer>({
  id: Number(route.params.id),
  name: '張小明',
  phone: '0912-345-678',
  email: 'zhang@example.com',
  level: 'vip',
  status: 'active',
  orderCount: 15,
  totalSpent: 25000,
  createdAt: '2024-01-15',
  notes: 'VIP客戶，經常購買高價位商品，服務態度良好。'
})

// 假訂單資料
const recentOrders = ref<Order[]>([
  {
    id: 'ORD-2024-001',
    date: '2024-03-15',
    itemCount: 3,
    amount: 2500,
    status: 'completed'
  },
  {
    id: 'ORD-2024-002',
    date: '2024-03-10',
    itemCount: 2,
    amount: 1800,
    status: 'completed'
  },
  {
    id: 'ORD-2024-003',
    date: '2024-03-05',
    itemCount: 5,
    amount: 3200,
    status: 'shipped'
  },
  {
    id: 'ORD-2024-004',
    date: '2024-02-28',
    itemCount: 1,
    amount: 1200,
    status: 'completed'
  }
])

// 計算屬性
const averageOrderValue = computed(() => {
  if (customer.value.orderCount === 0) return 0
  return Math.round(customer.value.totalSpent / customer.value.orderCount)
})

const daysSinceRegistration = computed(() => {
  const registrationDate = new Date(customer.value.createdAt)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - registrationDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// 方法
function handleSave(data: any) {
  // TODO: 串接 API
  Object.assign(customer.value, data)
  isEditing.value = false
}

function handleDelete() {
  showDeleteConfirm.value = true
}

function confirmDelete() {
  // TODO: 串接 API
  router.push('/customers')
}

function goBack() {
  router.push('/customers')
}

function getLevelBadge(level: string) {
  switch (level) {
    case 'vip': return 'badge bg-warning'
    case 'regular': return 'badge bg-primary'
    case 'new': return 'badge bg-success'
    default: return 'badge bg-secondary'
  }
}

function getLevelText(level: string) {
  switch (level) {
    case 'vip': return 'VIP'
    case 'regular': return '一般'
    case 'new': return '新客戶'
    default: return '未知'
  }
}

function getStatusBadge(status: string) {
  return status === 'active' ? 'badge bg-success' : 'badge bg-secondary'
}

function getOrderStatusBadge(status: string) {
  switch (status) {
    case 'completed': return 'badge bg-success'
    case 'shipped': return 'badge bg-secondary'
    case 'processing': return 'badge bg-warning'
    case 'cancelled': return 'badge bg-danger'
    default: return 'badge bg-secondary'
  }
}

function getOrderStatusText(status: string) {
  switch (status) {
    case 'completed': return '已完成'
    case 'shipped': return '已出貨'
    case 'processing': return '處理中'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-TW')
}
</script>

<style scoped>
.card-header h5 {
  margin-bottom: 0;
  font-weight: 600;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.fw-bold {
  font-weight: 600 !important;
}

@media (max-width: 768px) {
  .btn-group {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-group .btn {
    margin-bottom: 0.5rem;
  }
}
</style> 