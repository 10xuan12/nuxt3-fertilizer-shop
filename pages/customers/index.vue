<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>客戶管理</h1>
      <button class="btn btn-main" @click="goToCreate">
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

    <!-- 統計資訊 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5 class="card-title">總客戶數</h5>
            <h3 class="mb-0 text-white">{{ customers.length }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h5 class="card-title">活躍客戶</h5>
            <h3 class="mb-0 text-white">{{ activeCustomersCount }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <h5 class="card-title">VIP客戶</h5>
            <h3 class="mb-0 text-white">{{ vipCustomersCount }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <h5 class="card-title">本月新增</h5>
            <h3 class="mb-0 text-white">{{ newCustomersThisMonth }}</h3>
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
            <button class="btn btn-outline-primary btn-sm" @click="exportCustomers">
              <i class="bi bi-download me-1"></i>匯出
            </button>
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
                <th @click="sortBy('orderCount')" style="cursor:pointer;">
                  訂單數
                  <span v-if="sortKey === 'orderCount'">
                    <i :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                  </span>
                </th>
                <th @click="sortBy('totalSpent')" style="cursor:pointer;">
                  總消費
                  <span v-if="sortKey === 'totalSpent'">
                    <i :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                  </span>
                </th>
                <th>狀態</th>
                <th @click="sortBy('createdAt')" style="cursor:pointer;">
                  註冊時間
                  <span v-if="sortKey === 'createdAt'">
                    <i :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                  </span>
                </th>
                <th width="150">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in pagedCustomers" :key="customer.id">
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
                    <button class="btn btn-outline-primary" @click="goToDetail(customer.id)" title="查看詳情">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning" @click="goToDetail(customer.id)" title="編輯">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="openDeleteConfirm(customer)" title="刪除">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 分頁元件 -->
          <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center p-3 border-top">
            <div class="text-muted">
              顯示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredCustomers.length) }} 筆，共 {{ filteredCustomers.length }} 筆
            </div>
            <nav>
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">上一頁</a>
                </li>
                <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                  <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">下一頁</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 刪除確認彈窗 -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="確認刪除客戶"
      message="您確定要刪除這個客戶嗎？此操作無法復原。"
      :details="customerToDelete ? `客戶姓名：${customerToDelete.name}` : ''"
      type="delete"
      confirm-text="確認刪除"
      @confirm="confirmDeleteCustomer"
      @close="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
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
}

// 假資料 - 增加更多客戶資料
const customers = ref<Customer[]>([
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
  },
  {
    id: 4,
    name: '陳雅婷',
    phone: '0945-678-901',
    email: 'chen@example.com',
    level: 'vip',
    orderCount: 22,
    totalSpent: 45000,
    status: 'active',
    createdAt: '2023-12-20'
  },
  {
    id: 5,
    name: '林志明',
    phone: '0956-789-012',
    email: 'lin@example.com',
    level: 'regular',
    orderCount: 12,
    totalSpent: 18000,
    status: 'active',
    createdAt: '2024-01-08'
  },
  {
    id: 6,
    name: '黃淑芬',
    phone: '0967-890-123',
    email: 'huang@example.com',
    level: 'new',
    orderCount: 1,
    totalSpent: 1500,
    status: 'active',
    createdAt: '2024-03-15'
  },
  {
    id: 7,
    name: '劉建國',
    phone: '0978-901-234',
    email: 'liu@example.com',
    level: 'vip',
    orderCount: 18,
    totalSpent: 32000,
    status: 'active',
    createdAt: '2023-11-30'
  },
  {
    id: 8,
    name: '吳佳玲',
    phone: '0989-012-345',
    email: 'wu@example.com',
    level: 'regular',
    orderCount: 6,
    totalSpent: 9000,
    status: 'inactive',
    createdAt: '2024-02-25'
  },
  {
    id: 9,
    name: '蔡文雄',
    phone: '0990-123-456',
    email: 'cai@example.com',
    level: 'new',
    orderCount: 3,
    totalSpent: 4500,
    status: 'active',
    createdAt: '2024-03-10'
  },
  {
    id: 10,
    name: '許雅文',
    phone: '0901-234-567',
    email: 'xu@example.com',
    level: 'vip',
    orderCount: 25,
    totalSpent: 55000,
    status: 'active',
    createdAt: '2023-10-15'
  }
])

// 狀態管理
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const selectedCustomers = ref<number[]>([])

// 刪除確認彈窗狀態
const showDeleteConfirm = ref(false)
const customerToDelete = ref<Customer | null>(null)

// 分頁狀態
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / pageSize.value))

// 計算可見的分頁按鈕
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const pagedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredCustomers.value.slice(start, start + pageSize.value)
})

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  nextTick(() => {
    const table = document.querySelector('.table-responsive')
    if (table) table.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// 當篩選條件變動時自動回到第一頁
watch([searchQuery, statusFilter, levelFilter], () => { currentPage.value = 1 })

// 排序狀態
const sortKey = ref<'orderCount'|'totalSpent'|'createdAt'>('createdAt')
const sortOrder = ref<'asc'|'desc'>('desc')

function sortBy(key: 'orderCount'|'totalSpent'|'createdAt') {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

// 統計計算
const activeCustomersCount = computed(() => 
  customers.value.filter(c => c.status === 'active').length
)

const vipCustomersCount = computed(() => 
  customers.value.filter(c => c.level === 'vip').length
)

const newCustomersThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return customers.value.filter(c => new Date(c.createdAt) >= thisMonth).length
})

const router = useRouter()

function goToCreate() {
  router.push('/customers/create')
}

function goToDetail(id: number|string) {
  router.push(`/customers/${id}`)
}

function openDeleteConfirm(customer: Customer) {
  customerToDelete.value = customer
  showDeleteConfirm.value = true
}

function confirmDeleteCustomer() {
  if (customerToDelete.value) {
    customers.value = customers.value.filter(c => c.id !== customerToDelete.value!.id)
    customerToDelete.value = null
  }
  showDeleteConfirm.value = false
}

// 匯出功能
function exportCustomers() {
  // TODO: 串接API，匯出客戶資料
  const data = filteredCustomers.value.map(c => ({
    姓名: c.name,
    電話: c.phone,
    信箱: c.email,
    等級: getLevelText(c.level),
    狀態: c.status === 'active' ? '活躍' : '非活躍',
    訂單數: c.orderCount,
    總消費: c.totalSpent,
    註冊時間: formatDate(c.createdAt)
  }))
  
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `客戶資料_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

// 計算屬性
const filteredCustomers = computed(() => {
  let arr = customers.value.filter(customer => {
    const matchesSearch = !searchQuery.value || 
      customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      customer.phone.includes(searchQuery.value) ||
      customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || customer.status === statusFilter.value
    const matchesLevel = !levelFilter.value || customer.level === levelFilter.value
    return matchesSearch && matchesStatus && matchesLevel
  })
  
  // 排序
  if (sortKey.value) {
    arr = arr.slice().sort((a, b) => {
      let aVal: number|string = ''
      let bVal: number|string = ''
      if (sortKey.value === 'orderCount') {
        aVal = a.orderCount
        bVal = b.orderCount
      } else if (sortKey.value === 'totalSpent') {
        aVal = a.totalSpent
        bVal = b.totalSpent
      } else if (sortKey.value === 'createdAt') {
        aVal = new Date(a.createdAt).getTime()
        bVal = new Date(b.createdAt).getTime()
      }
      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
    })
  }
  return arr
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

@media (max-width: 768px) {
  .customer-info {
    max-width: 150px;
  }
}
</style> 