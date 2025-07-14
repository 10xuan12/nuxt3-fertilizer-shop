<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>編輯分類</h1>
      <NuxtLink to="/categories" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>返回列表
      </NuxtLink>
    </div>
    <div class="card mx-auto" style="max-width: 600px;">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label required">分類名稱</label>
            <input v-model="form.name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">描述</label>
            <textarea v-model="form.description" class="form-control" rows="3" placeholder="請輸入分類描述..."></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">狀態</label>
            <select v-model="form.status" class="form-select">
              <option value="active">啟用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">建立時間</label>
            <input v-model="form.createdAt" type="date" class="form-control" />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-main px-4">儲存變更</button>
            <NuxtLink to="/categories" class="btn btn-outline-secondary">取消</NuxtLink>
          </div>
        </form>
        <div v-if="success" class="alert alert-success mt-4">分類更新成功！</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

// TODO: 之後要串接後端 API，現在用假資料
const categories = [
  {
    id: 1,
    name: '有機肥料',
    description: '天然有機成分，對環境友善',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-01',
    sortOrder: 2,
    parentId: null,
    imageUrl: '/images/categories/organic.jpg',
    isVisible: true,
    tags: ['環保', '天然']
  },
  {
    id: 2,
    name: '複合肥料',
    description: '多種營養元素均衡配方',
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-06-01',
    sortOrder: 1,
    parentId: null,
    imageUrl: '/images/categories/complex.jpg',
    isVisible: true,
    tags: ['均衡', '多元素']
  },
  {
    id: 3,
    name: '液態肥料',
    description: '快速吸收的液態配方',
    status: 'inactive',
    createdAt: '2024-01-05',
    updatedAt: '2024-06-01',
    sortOrder: 3,
    parentId: null,
    imageUrl: '/images/categories/liquid.jpg',
    isVisible: false,
    tags: ['液態', '速效']
  }
]

// 編輯表單也要顯示這些欄位
// 例如：
// <input v-model="form.sortOrder" type="number" ... />
// <input v-model="form.parentId" type="number" ... />
// <input v-model="form.imageUrl" type="text" ... />
// <select v-model="form.isVisible" ...>...</select>
// <input v-model="form.tags" type="text" ... />

const found = categories.find(c => c.id === id)
const form = ref({
  name: found ? found.name : '',
  description: found ? found.description : '',
  status: found ? found.status : 'active',
  createdAt: found ? found.createdAt : new Date().toISOString().slice(0, 10)
})
const success = ref(false)

function handleSubmit() {
  // 基本驗證
  if (!form.value.name) {
    alert('請填寫分類名稱')
    return
  }
  
  // 模擬 API 更新
  success.value = true
  
  setTimeout(() => {
    router.push('/categories')
  }, 1200)
}

onMounted(() => {
  if (!found) {
    alert('找不到該分類')
    router.push('/categories')
  }
})
</script>

<style scoped>
.container {
  padding: var(--spacing-lg) var(--spacing);
}

.py-4 {
  padding-top: var(--spacing-lg) !important;
  padding-bottom: var(--spacing-lg) !important;
}

.mb-4 { margin-bottom: var(--spacing-lg) !important; }

.d-flex { display: flex !important; }

.justify-content-between { justify-content: space-between !important; }

.align-items-center { align-items: center !important; }

h1 {
  color: var(--color-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  letter-spacing: 1px;
}

.alert-success {
  border-left: 4px solid var(--color-success);
}

@media (max-width: 768px) {
  .card {
    padding: 0.5rem;
  }
  
  .card-body {
    padding: var(--spacing);
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style> 