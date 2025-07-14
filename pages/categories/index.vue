<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>分類管理</h1>
      <NuxtLink to="/categories/create" class="btn btn-main">
        <i class="bi bi-plus-circle me-2"></i>新增分類
      </NuxtLink>
    </div>

    <!-- 搜尋和篩選 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <select v-model="categoryFilter" class="form-select">
              <option value="">全部分類</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="statusFilter" class="form-select">
              <option value="">全部狀態</option>
              <option value="active">啟用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
          <div class="col-md-3">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-2"></i>清除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分類列表 -->
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">分類列表</h5>
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
        <div v-else-if="filteredCategories.length === 0" class="text-center py-5">
          <i class="bi bi-tags text-muted" style="font-size: 3rem;"></i>
          <p class="text-muted mt-3">沒有找到分類</p>
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

                <th>分類名稱</th>
                <th>商品總數量</th>
                <th>狀態</th>
                <th>建立時間</th>
                <th width="150">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in filteredCategories" :key="category.id" @click="selectCategory(category)" style="cursor:pointer;">
                <td>
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="selectedCategories.includes(category.id)"
                    @change.stop="toggleCategorySelection(category.id)"
                  />
                </td>

                <td>
                  <div class="category-info">
                    <h6 class="mb-1">{{ category.name }}</h6>
                    <small class="text-muted">{{ category.description || '無描述' }}</small>
                  </div>
                </td>
                <td>
                  <span :class="getProductCountClass(category.productCount)">
                    {{ category.productCount }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadge(category.status)">
                    {{ category.status === 'active' ? '啟用' : '停用' }}
                  </span>
                </td>
                <td>{{ formatDate(category.createdAt) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary"
                      @click.stop="handleView(category)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-warning"
                      @click.stop="toggleCategoryStatus(category)"
                    >
                      <i :class="category.status === 'active' ? 'bi bi-pause' : 'bi bi-play'"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      @click.stop="showDeleteConfirm(category)"
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

    <!-- 詳細資訊側邊卡片 -->
    <div v-if="selectedCategory" class="category-details-card">
      <h3>分類詳細資訊
        <button v-if="!isEditing" @click="startEditing" class="action-btn edit-btn">編輯</button>
      </h3>
      <div v-if="!isEditing">
        <p><strong>分類名稱:</strong> {{ selectedCategory.name }}</p>
        <p><strong>描述:</strong> {{ selectedCategory.description || '無描述' }}</p>
        <p><strong>商品數量:</strong> {{ selectedCategory.productCount }}</p>
        <p><strong>狀態:</strong>
          <span :class="getStatusBadge(selectedCategory.status)">
            {{ selectedCategory.status === 'active' ? '啟用' : '停用' }}
          </span>
        </p>
        <p><strong>建立時間:</strong> {{ formatDate(selectedCategory.createdAt) }}</p>
      </div>
      <div v-else class="edit-form">
        <div class="form-group">
          <label>分類名稱:</label>
          <input v-model="editedCategory.name" />
        </div>
        <div class="form-group">
          <label>描述:</label>
          <textarea v-model="editedCategory.description" rows="3" style="width:100%"></textarea>
        </div>
        <div class="form-group">
          <label>狀態:</label>
          <select v-model="editedCategory.status">
            <option value="active">啟用</option>
            <option value="inactive">停用</option>
          </select>
        </div>
        <div class="form-group">
          <label>建立時間:</label>
          <input v-model="editedCategory.createdAt" type="date" />
        </div>
        <div class="edit-actions">
          <button @click="saveEditing" class="action-btn save-btn">儲存</button>
          <button @click="cancelEditing" class="action-btn cancel-btn">取消</button>
        </div>
      </div>
    </div>

    <!-- 確認對話框 -->
    <ConfirmDialog
      :show="showConfirm"
      title="確認刪除分類"
      message="您確定要刪除這個分類嗎？此操作無法復原。"
      :details="`分類名稱：${categoryToDelete?.name}`"
      type="delete"
      confirm-text="確認刪除"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @close="showConfirm = false"
    />

    <!-- 成功訊息 -->
    <div v-if="showSuccessMessage" class="alert alert-success position-fixed" style="top: 20px; right: 20px; z-index: 1050; min-width: 300px;">
      <i class="bi bi-check-circle me-2"></i>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'

const categories = ref<any[]>([])
const loading = ref(false)
const bulkLoading = ref(false)
const deleteLoading = ref(false)
const categoryFilter = ref('')
const statusFilter = ref('')
const selectedCategories = ref<number[]>([])
const showConfirm = ref(false)
const categoryToDelete = ref<any>(undefined)
const selectedCategory = ref<any>(undefined)
const isEditing = ref(false)
const editedCategory = ref<any>(undefined)
const showSuccessMessage = ref(false)
const successMessage = ref('')

onMounted(async () => {
  // TODO: 之後要串接 API，現在用假資料
  categories.value = [
    {
      id: 1,
      name: '化學肥料',
      description: '常見的化學合成肥料',
      productCount: 10,
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-06-01',
      parentId: null,
      imageUrl: '/images/categories/chem.jpg',
      isVisible: true,
      tags: ['速效', '大量元素']
    },
    {
      id: 2,
      name: '有機肥料',
      description: '天然有機成分，對環境友善',
      productCount: 5,
      status: 'inactive',
      createdAt: '2024-01-02',
      updatedAt: '2024-06-01',
      parentId: null,
      imageUrl: '/images/categories/organic.jpg',
      isVisible: true,
      tags: ['環保', '天然']
    },
    {
      id: 3,
      name: '動物性有機肥料',
      description: '動物來源的有機肥料',
      productCount: 2,
      status: 'active',
      createdAt: '2024-01-03',
      updatedAt: '2024-06-01',
      parentId: 2,
      imageUrl: '/images/categories/animal.jpg',
      isVisible: false,
      tags: ['動物', '有機']
    }
  ]
  // try {
  //   const res = await fetch('/api/categories')
  //   categories.value = await res.json()
  // } catch (e) {
  //   categories.value = []
  // }

  // 檢查 URL 參數中是否有新分類資料
  const urlParams = new URLSearchParams(window.location.search)
  const newCategoryParam = urlParams.get('newCategory')
  if (newCategoryParam) {
    try {
      const newCategory = JSON.parse(decodeURIComponent(newCategoryParam))
      categories.value.unshift(newCategory)
      successMessage.value = `分類「${newCategory.name}」新增成功！`
      showSuccessMessage.value = true
      setTimeout(() => { showSuccessMessage.value = false }, 3000)
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    } catch (error) {
      // ignore
    }
  }
})

const filteredCategories = computed(() => {
  return categories.value.filter(category => {
    const matchesCategory = !categoryFilter.value || category.name === categoryFilter.value
    const matchesStatus = !statusFilter.value || category.status === statusFilter.value
    return matchesCategory && matchesStatus
  })
})

const selectAll = computed(() => {
  return filteredCategories.value.length > 0 && 
         selectedCategories.value.length === filteredCategories.value.length
})

function handleView(category: any) {
  selectCategory(category)
}
function handleDelete(id: number) {
  showDeleteConfirm(categories.value.find(c => c.id === id))
}
function clearFilters() {
  categoryFilter.value = ''
  statusFilter.value = ''
}
function toggleSelectAll() {
  if (selectAll.value) {
    selectedCategories.value = []
  } else {
    selectedCategories.value = filteredCategories.value.map(c => c.id)
  }
}
function toggleCategorySelection(categoryId: number) {
  const index = selectedCategories.value.indexOf(categoryId)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(categoryId)
  }
}
function clearSelection() {
  selectedCategories.value = []
}
function getProductCountClass(count: number) {
  if (count === 0) return 'text-muted'
  if (count <= 5) return 'text-warning'
  return 'text-success'
}
function getStatusBadge(status: string) {
  return status === 'active' ? 'badge bg-success' : 'badge bg-secondary'
}
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-TW')
}
function toggleCategoryStatus(category: any) {
  category.status = category.status === 'active' ? 'inactive' : 'active'
  const statusText = category.status === 'active' ? '啟用' : '停用'
  console.log(`分類「${category.name}」已${statusText}`)
}
function showDeleteConfirm(category: any) {
  categoryToDelete.value = category
  showConfirm.value = true
}
async function confirmDelete() {
  if (!categoryToDelete.value) return
  deleteLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const index = categories.value.findIndex(c => c.id === categoryToDelete.value.id)
    if (index > -1) {
      categories.value.splice(index, 1)
    }
    console.log('分類已成功刪除')
  } catch (error) {
    console.error('刪除失敗，請稍後再試')
  } finally {
    deleteLoading.value = false
    showConfirm.value = false
    categoryToDelete.value = null
  }
}
function selectCategory(category: any) {
  selectedCategory.value = category
  isEditing.value = false
  editedCategory.value = { ...category }
}
function startEditing() {
  isEditing.value = true
  editedCategory.value = { ...selectedCategory.value }
}
function saveEditing() {
  if (!editedCategory.value) return
  const idx = categories.value.findIndex((c: any) => c.id === editedCategory.value.id)
  if (idx !== -1) {
    categories.value[idx] = { ...editedCategory.value }
    selectedCategory.value = categories.value[idx]
    isEditing.value = false
  }
}
function cancelEditing() {
  isEditing.value = false
  editedCategory.value = { ...selectedCategory.value }
}
</script>

<style scoped>
.category-info {
  max-width: 200px;
}

.category-info h6 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.category-info small {
  font-size: 0.8rem;
  line-height: 1.2;
}

.category-details-card {
  margin-top: 30px;
  padding: 24px 18px;
  background-color: #fff;
  border-radius: var(--color-radius, 16px);
  box-shadow: var(--color-shadow, 0 2px 16px 0 rgba(44, 62, 80, 0.08));
  border-left: 5px solid var(--color-primary, #2E8B57);
  font-family: var(--color-font, 'Noto Sans TC', 'Microsoft JhengHei', Arial, sans-serif);
}

.category-details-card h3 {
  color: var(--color-primary, #2E8B57);
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: 700;
}

.category-details-card p {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 1.05em;
}

.category-details-card p strong {
  color: #555;
  margin-right: 5px;
}

@media (max-width: 768px) {
  .category-info {
    max-width: 150px;
  }
}
</style>
