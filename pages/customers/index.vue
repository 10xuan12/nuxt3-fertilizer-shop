<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>客戶管理</h1>
      <button class="btn btn-main">
        <i class="bi bi-plus-circle me-2"></i>新增客戶
      </button>
    </div>

    <!-- 搜尋和篩選 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="搜尋客戶姓名或電話..."
            />
          </div>
          <div class="col-md-3">
            <select v-model="statusFilter" class="form-select">
              <option value="">全部狀態</option>
              <option value="active">活躍</option>
              <option value="inactive">非活躍</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="levelFilter" class="form-select">
              <option value="">全部等級</option>
              <option value="vip">VIP</option>
              <option value="regular">一般</option>
              <option value="new">新客戶</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-2"></i>清除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 客戶列表 -->
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">客戶列表</h5>
          <div class="d-flex align-items-center gap-2">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                :checked="selectAll"
                @change="toggleSelectAll"
              />
              <label class="form-check-label">全選</label>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <LoadingSpinner size="lg" text="載入中..." />
        </div>
        <div v-else-if="filteredCustomers.length === 0" class="text-center py-5">
          <i class="bi bi-people text-muted" style="font-size: 3rem;"></i>
          <p class="text-muted mt-3">沒有找到客戶</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th width="50">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="selectAll"
                    @change="toggleSelectAll"
                  />
                </th>
                <th>客戶資訊</th>
                <th>聯絡方式</th>
                <th>等級</th>
                <th>訂單數</th>
                <th>總消費</th>
                <th>狀態</th>
                <th>註冊時間</th>
                <th width="150">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in filteredCustomers" :key="customer.id">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="selectedCustomers.includes(customer.id)"
                    @change="toggleCustomerSelection(customer.id)"
                  />
                </td>
                <td>
                  <div class="customer-info">
                    <h6 class="mb-1">{{ customer.name }}</h6>
                    <small class="text-muted">ID: {{ customer.id }}</small>
                  </div>
                </td>
                <td>
                  <div class="contact-info">
                    <div><i class="bi bi-telephone me-1"></i>{{ customer.phone }}</div>
                    <div><i class="bi bi-envelope me-1"></i>{{ customer.email }}</div>
                  </div>
                </td>
                <td>
                  <span :class="getLevelBadge(customer.level)">
                    {{ getLevelText(customer.level) }}
                  </span>
                </td>
                <td>{{ customer.orderCount }}</td>
                <td>${{ customer.totalSpent.toLocaleString() }}</td>
                <td>
                  <span :class="getStatusBadge(customer.status)">
                    {{ customer.status === 'active' ? '活躍' : '非活躍' }}
                  </span>
                </td>
                <td>{{ formatDate(customer.createdAt) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 批量操作 -->
    <BulkActions
      :selected-items="selectedCustomers"
      :loading="bulkLoading"
      @clear-selection="clearSelection"
      @bulk-delete="handleBulkDelete"
      @bulk-update-status="handleBulkUpdateStatus"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import BulkActions from '../../components/BulkActions.vue'

// 假資料
const customers = ref([
  {
    id: 1,
    name: '張小明',
    phone: '0912-345-678',
    email: 'zhang@example.com',
    level: 'vip',
    orderCount: 15,
    totalSpent: 25000,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: '李美玲',
    phone: '0923-456-789',
    email: 'li@example.com',
    level: 'regular',
    orderCount: 8,
    totalSpent: 12000,
    status: 'active',
    createdAt: '2024-02-10'
  },
  {
    id: 3,
    name: '王大華',
    phone: '0934-567-890',
    email: 'wang@example.com',
    level: 'new',
    orderCount: 2,
    totalSpent: 3000,
    status: 'inactive',
    createdAt: '2024-03-05'
  }
])

// 狀態管理
const loading = ref(false)
const bulkLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const selectedCustomers = ref<number[]>([])

// 計算屬性
const filteredCustomers = computed(() => {
  return customers.value.filter(customer => {
    const matchesSearch = !searchQuery.value || 
      customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.phone.includes(searchQuery.value) ||
      customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || customer.status === statusFilter.value
    const matchesLevel = !levelFilter.value || customer.level === levelFilter.value
    
    return matchesSearch && matchesStatus && matchesLevel
  })
})

const selectAll = computed(() => {
  return filteredCustomers.value.length > 0 && 
         selectedCustomers.value.length === filteredCustomers.value.length
})

// 方法
function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  levelFilter.value = ''
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedCustomers.value = []
  } else {
    selectedCustomers.value = filteredCustomers.value.map(c => c.id)
  }
}

function toggleCustomerSelection(customerId: number) {
  const index = selectedCustomers.value.indexOf(customerId)
  if (index > -1) {
    selectedCustomers.value.splice(index, 1)
  } else {
    selectedCustomers.value.push(customerId)
  }
}

function clearSelection() {
  selectedCustomers.value = []
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-TW')
}

async function handleBulkDelete(items: any[]) {
  bulkLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const idsToDelete = items.map(item => item.id)
    customers.value = customers.value.filter(c => !idsToDelete.includes(c.id))
    selectedCustomers.value = []
    console.log(`已成功刪除 ${items.length} 個客戶`)
  } catch (error) {
    console.error('批量刪除失敗，請稍後再試')
  } finally {
    bulkLoading.value = false
  }
}

async function handleBulkUpdateStatus(items: any[], status: string) {
  bulkLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    items.forEach(item => {
      const customer = customers.value.find(c => c.id === item.id)
      if (customer) {
        customer.status = status
      }
    })
    console.log(`已成功更新 ${items.length} 個客戶狀態`)
  } catch (error) {
    console.error('批量更新失敗，請稍後再試')
  } finally {
    bulkLoading.value = false
  }
}
</script>

<style scoped>
.customer-info h6 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.contact-info {
  font-size: 0.85rem;
}

.contact-info div {
  margin-bottom: 0.25rem;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}

.table th {
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 2px solid var(--color-border);
}

.table td {
  vertical-align: middle;
  border-bottom: 1px solid var(--color-border);
}

.table tbody tr:hover {
  background-color: var(--color-bg);
}

@media (max-width: 768px) {
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    margin-bottom: 0.25rem;
  }
  
  .customer-info {
    max-width: 150px;
  }
}
</style> 