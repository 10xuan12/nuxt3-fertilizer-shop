<template>
  <div class="container py-5" style="max-width: 600px;">
    <div class="card shadow p-4">
      <h2 class="mb-4 text-center">個人資料</h2>
      <div class="text-center mb-4">
        <img :src="avatarUrl" alt="頭像" class="rounded-circle mb-2" style="width: 96px; height: 96px; object-fit: cover; border: 2px solid #eee;">
        <div>
          <input type="file" accept="image/*" @change="handleAvatarChange" class="form-control d-inline-block w-auto mt-2" />
        </div>
        <small class="text-muted">（TODO）上傳頭像會呼叫後端 API 儲存</small>
      </div>
      <form @submit.prevent="handleSave">
        <div class="mb-3">
          <label class="form-label">姓名</label>
          <input v-model="form.name" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" class="form-control" disabled />
        </div>
        <div class="mb-3">
          <label class="form-label">角色</label>
          <input v-model="form.role" class="form-control" disabled />
        </div>
        <div class="mb-3">
          <label class="form-label">建立時間</label>
          <input v-model="form.createdAt" class="form-control" disabled />
        </div>
        <div class="mb-3">
          <label class="form-label">修改密碼</label>
          <input v-model="form.newPassword" type="password" class="form-control" placeholder="如需修改請輸入新密碼" />
        </div>
        <button type="submit" class="btn btn-main w-100">儲存變更</button>
      </form>
      <div v-if="successMsg" class="alert alert-success mt-3">{{ successMsg }}</div>
      <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const avatarUrl = ref('/placeholder-images-image_large.webp')
const form = ref({
  name: '管理員',
  email: 'admin@example.com',
  role: '超級管理員',
  createdAt: '2024-01-01',
  newPassword: ''
})
const successMsg = ref('')
const errorMsg = ref('')

function handleAvatarChange(e: Event) {
  // TODO: 呼叫後端 API 上傳頭像
  // 1. 取得檔案 e.target.files[0]
  // 2. 用 FormData 傳給 /api/profile/avatar
  // 3. 上傳成功後更新 avatarUrl
  errorMsg.value = '（TODO）請串接後端頭像上傳 API'
}

function handleSave() {
  // TODO: 呼叫後端 API 更新個人資料
  // 1. PATCH /api/profile { name, newPassword }
  // 2. 若 newPassword 為空則不修改密碼
  // 3. 成功顯示 successMsg，失敗顯示 errorMsg
  successMsg.value = '（TODO）請串接後端個人資料更新 API'
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.btn-main {
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  border: none;
}
.btn-main:hover {
  background: var(--color-primary-dark);
}
</style> 