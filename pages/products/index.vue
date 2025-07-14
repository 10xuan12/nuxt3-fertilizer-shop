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
          <div class="col-md-3">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="搜尋商品名稱或編號..."
            />
          </div>
          <div class="col-md-2">
            <select v-model="statusFilter" class="form-select">
              <option value="">全部狀態</option>
              <option value="active">啟用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
          <!-- 搜尋區分類下拉選單 -->
          <div class="col-md-3">
            <select v-model="categoryFilter" class="form-select">
              <option value="">全部分類</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
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
                <th>商家名稱</th>
                <th>商品編號</th>
                <th>商品名稱</th>
                <th>分類</th>
                <th>價格</th>
                <th style="white-space:nowrap;">庫存</th>
                <th>狀態</th>
                <th>建立時間</th>
                <th width="150">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id" style="cursor:pointer;">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="selectedProducts.includes(product.id)"
                    @change.stop="toggleProductSelection(product.id)"
                  />
                </td>
                <td>
                  <div class="company-info">
                    <h6 class="mb-1">{{ product.companyName }}</h6>
                    <small class="text-muted">{{ product.registrationNo }}</small>
                  </div>
                </td>
                <td>
                  <span class="product-code">{{ product.productCode }}</span>
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
                <td class="stock-cell">
                  <span :class="getStockClass(product.stock)">
                    {{ product.stock }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadge(product.status)">
                    {{ product.status === 'active' ? '上架' : '下架' }}
                  </span>
                </td>
                <td>{{ formatDate(product.createdAt) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary"
                      @click.stop="goToDetail(product)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-warning"
                      @click.stop="toggleProductStatus(product)"
                    >
                      <i :class="product.status === 'active' ? 'bi bi-pause' : 'bi bi-play'"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      @click.stop="handleDelete(product.id)"
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
import { ref, computed, nextTick, watch } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
// 移除 BulkActions import
import { useCategories } from '@/composables/useCategories'
import { useRouter } from 'vue-router'

const { categories } = useCategories()
const router = useRouter()

// TODO: 之後要串接 API，現在用假資料
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
    productCode: 'ORG-001',
    companyName: '綠農有機肥料有限公司',
    registrationNo: '農肥製字第123456號',
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
    productCode: 'COMP-002',
    companyName: '豐收肥料製造廠',
    registrationNo: '農肥製字第789012號',
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
    productCode: 'LIQ-003',
    companyName: '速效農業科技公司',
    registrationNo: '農肥製字第345678號',
    createdAt: '2024-01-05'
  }
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
const productToDelete = ref<any>(undefined)
const selectedProduct = ref<any>(undefined)
const isEditing = ref(false)
const editedProduct = ref<any>(undefined)

// 計算屬性
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = !searchQuery.value || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchQuery.value.toLowerCase())
    
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
function goToDetail(product: any) {
  router.push(`/products/${product.id}`)
}

function handleDelete(id: number) {
  showDeleteConfirm(products.value.find(p => p.id === id))
}

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
  const newStatus = product.status === 'active' ? 'inactive' : 'active'
  product.status = newStatus
  const statusText = newStatus === 'active' ? '啟用' : '停用'
  console.log(`商品「${product.name}」已${statusText}`)
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

// 移除分頁、排序、搜尋、篩選等以外的批量操作相關程式碼
// ... existing code ...
</script>

<style scoped>
.company-info {
  max-width: 200px;
}

.company-info h6 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.company-info small {
  font-size: 0.8rem;
  line-height: 1.2;
}

.product-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #666;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
}

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

/* 庫存欄位樣式 */
.stock-cell {
  white-space: nowrap;
  text-align: center;
  font-weight: 600;
}

.stock-cell .text-danger {
  color: var(--color-danger) !important;
}

.stock-cell .text-warning {
  color: var(--color-warning) !important;
}

.stock-cell .text-success {
  color: var(--color-success) !important;
}

.product-details-card {
  margin-top: 30px;
  padding: 24px 18px;
  background-color: #fff;
  border-radius: var(--color-radius, 16px);
  box-shadow: var(--color-shadow, 0 2px 16px 0 rgba(44, 62, 80, 0.08));
  border-left: 5px solid var(--color-primary, #2E8B57);
  font-family: var(--color-font, 'Noto Sans TC', 'Microsoft JhengHei', Arial, sans-serif);
}

.product-details-card h3 {
  color: var(--color-primary, #2E8B57);
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: 700;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h5 {
  color: var(--color-primary, #2E8B57);
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
}

.company-detail-info p {
  margin-bottom: 5px;
}

.product-details-card p {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 1.05em;
}

.product-details-card p strong {
  color: #555;
  margin-right: 5px;
}

@media (max-width: 768px) {
  .product-info {
    max-width: 150px;
  }
}
.edit-form input[type="date"],
.edit-form select,
.edit-form textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-family: var(--color-font, 'Noto Sans TC', 'Microsoft JhengHei', Arial, sans-serif);
}

.edit-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background-color: var(--color-primary, #2E8B57);
  color: white;
}

.save-btn:hover {
  background-color: #256b45;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}
</style>
