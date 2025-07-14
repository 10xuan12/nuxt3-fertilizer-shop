<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-content customer-modal">
      <div class="modal-header">
        <h5 class="modal-title">{{ mode === 'edit' ? '編輯客戶' : '新增客戶' }}</h5>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- 基本資訊 -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label required">姓名</label>
              <input 
                v-model="form.name" 
                class="form-control" 
                :class="{ 'is-invalid': errors.name }"
                required 
                placeholder="請輸入客戶姓名"
              />
              <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label required">電話</label>
              <input 
                v-model="form.phone" 
                class="form-control" 
                :class="{ 'is-invalid': errors.phone }"
                required 
                placeholder="請輸入電話號碼"
              />
              <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label required">Email</label>
            <input 
              v-model="form.email" 
              class="form-control" 
              :class="{ 'is-invalid': errors.email }"
              type="email" 
              required 
              placeholder="請輸入電子郵件"
            />
            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">等級</label>
              <select v-model="form.level" class="form-select">
                <option value="new">新客戶</option>
                <option value="regular">一般</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">狀態</label>
              <select v-model="form.status" class="form-select">
                <option value="active">活躍</option>
                <option value="inactive">非活躍</option>
              </select>
            </div>
          </div>

          <!-- 統計資訊 (僅編輯模式顯示) -->
          <div v-if="mode === 'edit'" class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">訂單數</label>
              <input 
                v-model.number="form.orderCount" 
                class="form-control" 
                type="number" 
                min="0" 
                placeholder="0"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">總消費</label>
              <input 
                v-model.number="form.totalSpent" 
                class="form-control" 
                type="number" 
                min="0" 
                placeholder="0"
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">註冊時間</label>
            <input 
              v-model="form.createdAt" 
              class="form-control" 
              type="date" 
              :required="mode === 'add'"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">備註</label>
            <textarea 
              v-model="form.notes" 
              class="form-control" 
              rows="3" 
              placeholder="請輸入備註資訊..."
            ></textarea>
          </div>

          <div class="modal-footer d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-main px-4" :disabled="isSubmitting">
              <i v-if="isSubmitting" class="bi bi-arrow-clockwise me-2"></i>
              {{ mode === 'edit' ? '儲存變更' : '新增' }}
            </button>
            <NuxtLink to="/customers" class="btn btn-outline-secondary">
              取消
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'

interface Customer {
  name: string
  phone: string
  email: string
  level: string
  status: string
  orderCount: number
  totalSpent: number
  createdAt: string
  notes?: string
}

interface FormErrors {
  name?: string
  phone?: string
  email?: string
}

const props = defineProps<{
  show: boolean
  customer: Customer | null
  mode: 'add' | 'edit'
}>()

const emit = defineEmits(['save', 'close'])

const isSubmitting = ref(false)
const errors = reactive<FormErrors>({})

const form = ref<Customer>({
  name: '',
  phone: '',
  email: '',
  level: 'regular',
  status: 'active',
  orderCount: 0,
  totalSpent: 0,
  createdAt: '',
  notes: ''
})

// 表單驗證
function validateForm(): boolean {
  errors.name = ''
  errors.phone = ''
  errors.email = ''

  if (!form.value.name.trim()) {
    errors.name = '請輸入客戶姓名'
  }

  if (!form.value.phone.trim()) {
    errors.phone = '請輸入電話號碼'
  } else if (!/^[\d\-\+\(\)\s]+$/.test(form.value.phone)) {
    errors.phone = '請輸入有效的電話號碼'
  }

  if (!form.value.email.trim()) {
    errors.email = '請輸入電子郵件'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.email = '請輸入有效的電子郵件格式'
  }

  return !errors.name && !errors.phone && !errors.email
}

// 初始化表單資料
watch(() => props.customer, (val) => {
  if (props.mode === 'edit' && val) {
    form.value = { ...val }
  } else if (props.mode === 'add') {
    form.value = {
      name: '',
      phone: '',
      email: '',
      level: 'regular',
      status: 'active',
      orderCount: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString().split('T')[0],
      notes: ''
    }
  }
}, { immediate: true })

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  
  try {
    // 模擬 API 呼叫延遲
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('save', { ...form.value })
  } catch (error) {
    console.error('儲存失敗:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.customer-modal {
  max-width: 600px;
  margin: 20px auto;
  background: #fff;
}

.modal-header {
  background: #256b45;
  color: #fff;
  border-bottom: 2px solid var(--color-primary);
}
.modal-header .modal-title {
  color: #fff !important;
}

.modal-header .btn-close {
  filter: invert(1);
}

.form-label.required::after {
  content: '*';
  color: var(--color-danger);
  margin-left: 0.3em;
}

.invalid-feedback {
  display: block;
  font-size: 0.875rem;
  color: var(--color-danger);
}

.form-control.is-invalid {
  border-color: var(--color-danger);
}

.form-control.is-invalid:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

@media (max-width: 768px) {
  .customer-modal {
    margin: 20px;
    max-width: none;
  }
}
</style> 