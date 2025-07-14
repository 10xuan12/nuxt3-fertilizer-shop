<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>新增商家</h1>
      <NuxtLink to="/stores" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>返回列表
      </NuxtLink>
    </div>
    <div class="card mx-auto" style="max-width: 600px;">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label required">商家名稱</label>
            <input v-model="form.name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label required">負責人姓名</label>
            <input v-model="form.contactPerson" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label required">聯絡電話</label>
            <input v-model="form.phone" type="tel" class="form-control" required pattern="^09\d{8}$" placeholder="09xxxxxxxx" />
          </div>
          <div class="mb-3">
            <label class="form-label required">Email</label>
            <input v-model="form.email" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">LOGO圖片網址</label>
            <input v-model="form.logo" type="url" class="form-control" placeholder="https://..." />
          </div>
          <div class="mb-3">
            <label class="form-label">商家統編</label>
            <input v-model="form.ubnid" type="text" class="form-control" placeholder="請輸入8碼統一編號" maxlength="8" />
          </div>
          <div class="mb-3">
            <label class="form-label">分類</label>
            <select v-model="form.category" class="form-select">
              <option value="">請選擇分類</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">狀態</label>
            <select v-model="form.status" class="form-select">
              <option value="審核中">審核中</option>
              <option value="啟用">啟用</option>
              <option value="停用">停用</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">加入日期</label>
            <input v-model="form.joinDate" type="date" class="form-control" />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-main px-4">送出</button>
            <NuxtLink to="/stores" class="btn btn-outline-secondary">取消</NuxtLink>
          </div>
        </form>
        <div v-if="success" class="alert alert-success mt-4">商家新增成功！</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '@/composables/useCategories'

const router = useRouter()
const { categories } = useCategories()
const today = new Date().toISOString().slice(0, 10)
const form = ref({
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  category: '',
  status: '審核中',
  joinDate: today,
  logo: '',
  ubnid: ''
})
const success = ref(false)

function handleSubmit() {
  // TODO: 之後要串接後端 API，現在用假資料
  // 基本驗證
  if (!form.value.name || !form.value.contactPerson || !form.value.phone || !form.value.email) {
    alert('請填寫所有必填欄位')
    return
  }
  if (!/^09\d{8}$/.test(form.value.phone)) {
    alert('請輸入正確的手機號碼格式')
    return
  }
  
  // 模擬 API 新增
  // TODO: 串接API，新增商家（含LOGO與統編）
  success.value = true
  
  // 創建新商家資料
  const newStore = {
    id: `S${Date.now().toString().slice(-4)}`,
    name: form.value.name,
    contactPerson: form.value.contactPerson,
    phone: form.value.phone,
    email: form.value.email,
    category: form.value.category,
    status: form.value.status,
    orderCount: 0,
    joinDate: form.value.joinDate,
    logo: form.value.logo,
    ubnid: form.value.ubnid
  }
  
  // 將新商家資料編碼並傳遞到商家列表頁面
  const encodedStore = encodeURIComponent(JSON.stringify(newStore))
  
  setTimeout(() => {
    router.push(`/stores?newStore=${encodedStore}`)
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
