<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>商品管理</h1>
      <NuxtLink to="/products/create" class="btn btn-main">
        <i class="bi bi-plus-circle me-2"></i>新增商品
      </NuxtLink>
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
              placeholder="搜尋商品名稱..."
            />
          </div>
          <div class="col-md-3">
            <select v-model="statusFilter" class="form-select">
              <option value="">全部狀態</option>
              <option value="active">啟用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="categoryFilter" class="form-select">
              <option value="">全部分類</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
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

    <!-- 商品列表 -->
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">商品列表</h5>
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
        <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
          <i class="bi bi-box text-muted" style="font-size: 3rem;"></i>
          <p class="text-muted mt-3">沒有找到商品</p>
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
                <th>商品圖片</th>
                <th>商品名稱</th>
                <th>分類</th>
                <th>價格</th>
                <th>庫存</th>
                <th>狀態</th>
                <th>建立時間</th>
                <th width="150">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="selectedProducts.includes(product.id)"
                    @change="toggleProductSelection(product.id)"
                  />
                </td>
                <td>
                  <img 
                    :src="product.image" 
                    :alt="product.name" 
                    class="product-thumb"
                  />
                </td>
                <td>
                  <div class="product-info">
                    <h6 class="mb-1">{{ product.name }}</h6>
                    <small class="text-muted">{{ product.description }}</small>
                  </div>
                </td>
                <td>
                  <span class="badge bg-light text-dark">{{ product.category }}</span>
                </td>
                <td>${{ product.price }}</td>
                <td>
                  <span :class="getStockClass(product.stock)">
                    {{ product.stock }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadge(product.status)">
                    {{ product.status === 'active' ? '啟用' : '停用' }}
                  </span>
                </td>
                <td>{{ formatDate(product.createdAt) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <NuxtLink 
                      :to="`/products/${product.id}`" 
                      class="btn btn-outline-primary"
                    >
                      <i class="bi bi-eye"></i>
                    </NuxtLink>
                    <button 
                      class="btn btn-outline-warning"
                      @click="toggleProductStatus(product)"
                    >
                      <i :class="product.status === 'active' ? 'bi bi-pause' : 'bi bi-play'"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      @click="showDeleteConfirm(product)"
                    >
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
      :selected-items="selectedProducts"
      :loading="bulkLoading"
      @clear-selection="clearSelection"
      @bulk-delete="handleBulkDelete"
      @bulk-update-status="handleBulkUpdateStatus"
    />

    <!-- 確認對話框 -->
    <ConfirmDialog
      :show="showConfirm"
      title="確認刪除商品"
      message="您確定要刪除這個商品嗎？此操作無法復原。"
      :details="`商品名稱：${productToDelete?.name}`"
      type="delete"
      confirm-text="確認刪除"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @close="showConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import BulkActions from '../../components/BulkActions.vue'

// 假資料
const products = ref([
  {
    id: 1,
    name: '有機肥料A',
    description: '高品質有機肥料，適合各種植物',
    category: '有機肥料',
    price: 299,
    stock: 50,
    status: 'active',
    image: '/placeholder-images-image_large.webp',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: '複合肥料B',
    description: '氮磷鉀均衡配方',
    category: '複合肥料',
    price: 199,
    stock: 25,
    status: 'active',
    image: '/placeholder-images-image_large.webp',
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    name: '速效肥料C',
    description: '快速見效的液態肥料',
    category: '液態肥料',
    price: 399,
    stock: 10,
    status: 'inactive',
    image: '/placeholder-images-image_large.webp',
    createdAt: '2024-01-05'
  }
])

const categories = ref([
  { id: 1, name: '有機肥料' },
  { id: 2, name: '複合肥料' },
  { id: 3, name: '液態肥料' }
])

// 狀態管理
const loading = ref(false)
const bulkLoading = ref(false)
const deleteLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const selectedProducts = ref<number[]>([])
const showConfirm = ref(false)
const productToDelete = ref<any>(null)

// 計算屬性
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = !searchQuery.value || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || product.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || product.category === categoryFilter.value
    
    return matchesSearch && matchesStatus && matchesCategory
  })
})

const selectAll = computed(() => {
  return filteredProducts.value.length > 0 && 
         selectedProducts.value.length === filteredProducts.value.length
})

// 方法
function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedProducts.value = []
  } else {
    selectedProducts.value = filteredProducts.value.map(p => p.id)
  }
}

function toggleProductSelection(productId: number) {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

function clearSelection() {
  selectedProducts.value = []
}

function getStockClass(stock: number) {
  if (stock <= 10) return 'text-danger fw-bold'
  if (stock <= 30) return 'text-warning'
  return 'text-success'
}

function getStatusBadge(status: string) {
  return status === 'active' ? 'badge bg-success' : 'badge bg-secondary'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-TW')
}

function toggleProductStatus(product: any) {
  product.status = product.status === 'active' ? 'inactive' : 'active'
  console.log(`商品「${product.name}」狀態已更新`)
}

function showDeleteConfirm(product: any) {
  productToDelete.value = product
  showConfirm.value = true
}

async function confirmDelete() {
  if (!productToDelete.value) return
  
  deleteLoading.value = true
  try {
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = products.value.findIndex(p => p.id === productToDelete.value.id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
    
    console.log('商品已成功刪除')
  } catch (error) {
    console.error('刪除失敗，請稍後再試')
  } finally {
    deleteLoading.value = false
    showConfirm.value = false
    productToDelete.value = null
  }
}

async function handleBulkDelete(items: any[]) {
  bulkLoading.value = true
  try {
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const idsToDelete = items.map(item => item.id)
    products.value = products.value.filter(p => !idsToDelete.includes(p.id))
    selectedProducts.value = []
    
    console.log(`已成功刪除 ${items.length} 個商品`)
  } catch (error) {
    console.error('批量刪除失敗，請稍後再試')
  } finally {
    bulkLoading.value = false
  }
}

async function handleBulkUpdateStatus(items: any[], status: string) {
  bulkLoading.value = true
  try {
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    items.forEach(item => {
      const product = products.value.find(p => p.id === item.id)
      if (product) {
        product.status = status
      }
    })
    
    console.log(`已成功更新 ${items.length} 個商品狀態`)
  } catch (error) {
    console.error('批量更新失敗，請稍後再試')
  } finally {
    bulkLoading.value = false
  }
}
</script>

<style scoped>
.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
}

.product-info {
  max-width: 200px;
}

.product-info h6 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.product-info small {
  font-size: 0.8rem;
  line-height: 1.2;
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
  
  .product-info {
    max-width: 150px;
  }
}
</style>
