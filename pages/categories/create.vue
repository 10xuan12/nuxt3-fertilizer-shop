<template>
  <div class="container py-4">
    <h1 class="mb-4">新增分類</h1>
    <form @submit.prevent="submitForm" class="category-form mx-auto">
      <div class="mb-3">
        <label class="form-label required">分類名稱</label>
        <input v-model="form.name" type="text" class="form-control" :class="{'is-invalid': errors.name}" />
        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
      </div>
      <button type="submit" class="btn btn-main w-100">新增分類</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: ''
})

const errors = reactive({
  name: ''
})

function submitForm() {
  errors.name = form.name ? '' : '請輸入分類名稱'
  if (errors.name) return
  alert('送出成功！(可串接API)')
}
</script>

<style scoped>
.category-form {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(44, 62, 80, 0.08);
  padding: 2.5rem 2rem;
  max-width: 400px;
}
</style> 