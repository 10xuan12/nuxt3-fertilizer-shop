<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>新增分類</h1>
      <NuxtLink to="/categories" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>返回列表
      </NuxtLink>
    </div>
    <div class="card mx-auto" style="max-width: 600px;">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- 表單區塊只保留基本欄位 -->
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
            <button type="submit" class="btn btn-main px-4">送出</button>
            <NuxtLink to="/categories" class="btn btn-outline-secondary">取消</NuxtLink>
          </div>
        </form>
        <div v-if="success" class="alert alert-success mt-4">分類新增成功！</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const today = new Date().toISOString().slice(0, 10)
const form = ref({
  name: '',
  description: '',
  status: 'active',
  createdAt: today
})
const success = ref(false)

function handleSubmit() {
  // TODO: 之後要串接後端 API，現在用假資料
  if (!form.value.name) {
    alert('請填寫分類名稱')
    return
  }
  success.value = true
  const newCategory = {
    id: Date.now(),
    name: form.value.name,
    description: form.value.description,
    productCount: 0,
    status: form.value.status,
    createdAt: form.value.createdAt
  }
  const encodedCategory = encodeURIComponent(JSON.stringify(newCategory))
  setTimeout(() => {
    router.push(`/categories?newCategory=${encodedCategory}`)
  }, 1200)
}
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