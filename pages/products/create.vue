<template>
  <div class="container py-4">
    <h1 class="mb-4">新增商品</h1>
    <form @submit.prevent="submitForm" class="product-form mx-auto">
      <div class="mb-3">
        <label class="form-label">肥料類型</label>
        <select v-model="form.type" class="form-select">
          <option value="">請選擇</option>
          <option value="有機">有機</option>
          <option value="複合">複合</option>
          <option value="速效">速效</option>
          <option value="液態">液態</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label required">廠牌商品名稱</label>
        <input v-model="form.brandName" type="text" class="form-control" :class="{'is-invalid': errors.brandName}" />
        <div v-if="errors.brandName" class="invalid-feedback">{{ errors.brandName }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label required">業者名稱</label>
        <input v-model="form.companyName" type="text" class="form-control" :class="{'is-invalid': errors.companyName}" />
        <div v-if="errors.companyName" class="invalid-feedback">{{ errors.companyName }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label required">登記字號</label>
        <input v-model="form.registrationNo" type="text" class="form-control" :class="{'is-invalid': errors.registrationNo}" />
        <div v-if="errors.registrationNo" class="invalid-feedback">{{ errors.registrationNo }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label required">品目名稱</label>
        <input v-model="form.itemName" type="text" class="form-control" :class="{'is-invalid': errors.itemName}" />
        <div v-if="errors.itemName" class="invalid-feedback">{{ errors.itemName }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label required">性狀</label>
        <select v-model="form.property" class="form-select" :class="{'is-invalid': errors.property}">
          <option value="">請選擇</option>
          <option value="固體">固體</option>
          <option value="液體">液體</option>
          <option value="粉末">粉末</option>
          <option value="顆粒">顆粒</option>
        </select>
        <div v-if="errors.property" class="invalid-feedback">{{ errors.property }}</div>
      </div>
      <div class="mb-3">
        <label class="form-label">適用作物</label>
        <input v-model="form.crops" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">產品介紹</label>
        <textarea v-model="form.intro" class="form-control" rows="3"></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">登記證有效日期</label>
        <input v-model="form.validDate" type="date" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">產品規格</label>
        <input v-model="form.spec" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">產品圖片</label>
        <input type="file" class="form-control" @change="onFileChange" />
        <div v-if="form.imageUrl" class="mt-2">
          <img :src="form.imageUrl" alt="預覽" style="max-width: 120px; border-radius: 8px;" />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">生產紀錄</label>
        <textarea v-model="form.productionRecord" class="form-control" rows="2"></textarea>
      </div>
      <button type="submit" class="btn btn-main w-100">新增商品</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  type: '',
  brandName: '',
  companyName: '',
  registrationNo: '',
  itemName: '',
  property: '',
  crops: '',
  intro: '',
  validDate: '',
  spec: '',
  image: null as File | null,
  imageUrl: '',
  productionRecord: ''
})

const errors = reactive({
  brandName: '',
  companyName: '',
  registrationNo: '',
  itemName: '',
  property: ''
})

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    form.image = file
    form.imageUrl = URL.createObjectURL(file)
  }
}

function submitForm() {
  errors.brandName = form.brandName ? '' : '請輸入廠牌商品名稱'
  errors.companyName = form.companyName ? '' : '請輸入業者名稱'
  errors.registrationNo = form.registrationNo ? '' : '請輸入登記字號'
  errors.itemName = form.itemName ? '' : '請輸入品目名稱'
  errors.property = form.property ? '' : '請選擇性狀'
  if (errors.brandName || errors.companyName || errors.registrationNo || errors.itemName || errors.property) return
  alert('送出成功！(可串接API)')
}
</script>

<style scoped>
.product-form {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(44, 62, 80, 0.08);
  padding: 2.5rem 2rem;
  max-width: 520px;
}
.form-label.required::after {
  content: '*';
  color: #e74c3c;
  margin-left: 0.3em;
}
.btn-main {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  box-shadow: 0 1px 4px 0 rgba(44, 62, 80, 0.08);
  transition: background 0.18s;
}
.btn-main:hover, .btn-main:focus {
  background: #256b45;
  color: #fff;
}
@media (max-width: 767px) {
  .product-form {
    padding: 1.2rem 0.5rem;
  }
}
</style>
