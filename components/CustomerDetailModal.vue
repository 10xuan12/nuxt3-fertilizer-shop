<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-content customer-detail-modal">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="bi bi-person-circle me-2"></i>客戶詳細資料
        </h5>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>
      <div class="modal-body">
        <div v-if="customer" class="customer-details">
          <!-- 基本資訊 -->
          <div class="detail-section">
            <h6 class="section-title">
              <i class="bi bi-info-circle me-2"></i>基本資訊
            </h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="detail-label">姓名</label>
                <p class="detail-value">{{ customer.name }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="detail-label">客戶等級</label>
                <p class="detail-value">
                  <span :class="getLevelBadge(customer.level)">
                    {{ getLevelText(customer.level) }}
                  </span>
                </p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="detail-label">電話</label>
                <p class="detail-value">
                  <i class="bi bi-telephone me-1"></i>{{ customer.phone }}
                </p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="detail-label">Email</label>
                <p class="detail-value">
                  <i class="bi bi-envelope me-1"></i>{{ customer.email }}
                </p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="detail-label">狀態</label>
                <p class="detail-value">
                  <span :class="getStatusBadge(customer.status)">
                    {{ customer.status === 'active' ? '活躍' : '非活躍' }}
                  </span>
                </p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="detail-label">註冊時間</label>
                <p class="detail-value">{{ formatDate(customer.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- 統計資訊 -->
          <div class="detail-section">
            <h6 class="section-title">
              <i class="bi bi-graph-up me-2"></i>統計資訊
            </h6>
            <div class="row">
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-number">{{ customer.orderCount }}</div>
                  <div class="stat-label">總訂單數</div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-number">${{ customer.totalSpent.toLocaleString() }}</div>
                  <div class="stat-label">總消費金額</div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-number">${{ averageOrderValue }}</div>
                  <div class="stat-label">平均訂單金額</div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-number">{{ daysSinceRegistration }}</div>
                  <div class="stat-label">註冊天數</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 備註資訊 -->
          <div class="detail-section" v-if="customer.notes">
            <h6 class="section-title">
              <i class="bi bi-chat-text me-2"></i>備註
            </h6>
            <div class="notes-content">
              {{ customer.notes }}
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-primary" @click="$emit('edit')">
          <i class="bi bi-pencil me-2"></i>編輯
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          <i class="bi bi-x-circle me-2"></i>關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const props = defineProps<{
  show: boolean
  customer: Customer | null
}>()

const emit = defineEmits(['close', 'edit'])

// 計算屬性
const averageOrderValue = computed(() => {
  if (!props.customer || props.customer.orderCount === 0) return 0
  return Math.round(props.customer.totalSpent / props.customer.orderCount)
})

const daysSinceRegistration = computed(() => {
  if (!props.customer) return 0
  const registrationDate = new Date(props.customer.createdAt)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - registrationDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-TW')
}
</script>

<style scoped>
.customer-detail-modal {
  max-width: 700px;
  margin: 60px auto;
}

.modal-header {
  background: var(--color-primary);
  color: white;
}

.modal-header .btn-close {
  filter: invert(1);
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-secondary);
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.detail-value {
  font-weight: 500;
  margin-bottom: 0;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: var(--color-bg-light);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0;
}

.notes-content {
  background: var(--color-bg-light);
  padding: 1rem;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--color-primary);
  font-style: italic;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .customer-detail-modal {
    margin: 20px;
    max-width: none;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
}
</style> 