<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>商家管理</h1>
      <NuxtLink to="/stores/create" class="btn btn-main">
        <i class="bi bi-plus-circle me-2"></i>新增商家
      </NuxtLink>
    </div>
    <div class="card mb-4">
      <div class="card-body">
        <form class="row g-2 align-items-center flex-wrap">
          <div class="col-12 col-md-4">
            <input v-model="keywordSearch" @input="searchStores" placeholder="搜尋店名、電話、Email" class="form-control" />
          </div>
          <div class="col-6 col-md-3">
            <select v-model="statusFilter" @change="searchStores" class="form-select">
              <option value="全部">全部狀態</option>
              <option value="啟用">啟用</option>
              <option value="停用">停用</option>
              <option value="審核中">審核中</option>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <input type="date" v-model="dateStartFilter" @change="searchStores" class="form-control" placeholder="加入日期" />
          </div>
          <div class="col-6 col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-2"></i>清除
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">商家列表</h5>
        </div>
      </div>
      <div class="card-body p-0">
        <div v-if="displayedStores.length === 0" class="text-center py-5">
          <i class="bi bi-shop text-muted" style="font-size: 3rem;"></i>
          <p class="text-muted mt-3">目前沒有符合條件的店家</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>商家名稱</th>
                <th>商家編號</th>
                <th>負責人姓名</th>
                <th>聯絡電話</th>
                <th>Email</th>
                <th>狀態</th>
                <th>訂單總數量</th>
                <th>加入日期</th>
                <th style="width: 150px;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="store in displayedStores" :key="store.id" @click="selectStore(store)" style="cursor:pointer;">
                <td>{{ store.name }}</td>
                <td>{{ store.id }}</td>
                <td>{{ store.contactPerson }}</td>
                <td>{{ store.phone }}</td>
                <td>{{ store.email }}</td>
                <td>
                  <span :class="getStatusBadge(store.status)">
                    {{ store.status }}
                  </span>
                </td>
                <td>{{ store.orderCount }}</td>
                <td>{{ store.joinDate }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary"
                      @click.stop="handleView(store)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-warning"
                      @click.stop="toggleStoreStatus(store)"
                      :disabled="store.status === '審核中'"
                      :title="store.status === '審核中' ? '審核中商家無法切換狀態' : ''"
                    >
                      <i :class="store.status === '啟用' ? 'bi bi-pause' : 'bi bi-play'"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      @click.stop="handleDelete(store.id)"
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

    <!-- 詳細資訊與編輯 -->
    <div v-if="selectedStore" class="store-details-card">
      <h3>商家詳細資訊
        <div class="action-buttons">
          <button v-if="!isEditing" @click="startEditing" class="action-btn edit-btn">編輯</button>
          <button @click="closeDetails" class="action-btn close-btn">收起</button>
        </div>
      </h3>
      <div v-if="!isEditing">
        <p><strong>LOGO</strong>
          <span v-if="selectedStore.logo">
            <img :src="selectedStore.logo" alt="logo" style="max-width:60px;max-height:60px;border-radius:8px;vertical-align:middle;" />
          </span>
          <span v-else class="text-muted">無</span>
        </p>
        <p><strong>商家名稱:</strong> {{ selectedStore.name }}</p>
        <p><strong>商家編號:</strong> {{ selectedStore.id }}</p>
        <p><strong>商家統編:</strong> {{ selectedStore.ubnid || '—' }}</p>
        <p><strong>負責人姓名:</strong> {{ selectedStore.contactPerson }}</p>
        <p><strong>聯絡電話:</strong> {{ selectedStore.phone }}</p>
        <p><strong>Email:</strong> {{ selectedStore.email }}</p>
        <p><strong>狀態:</strong>
          <span :class="getStatusBadge(selectedStore.status)">
            {{ selectedStore.status }}
          </span>
        </p>
        <p><strong>訂單總數量:</strong> {{ selectedStore.orderCount }}</p>
        <p><strong>加入日期:</strong> {{ selectedStore.joinDate }}</p>
      </div>
      <div v-else class="edit-form" v-if="editedStore">
        <div class="form-group">
          <label>LOGO圖片網址:</label>
          <input v-model="editedStore.logo" placeholder="請輸入LOGO圖片網址" />
        </div>
        <div class="form-group">
          <label>商家名稱:</label>
          <input v-model="editedStore.name" />
        </div>
        <div class="form-group">
          <label>商家統編:</label>
          <input v-model="editedStore.ubnid" placeholder="請輸入8碼統一編號" />
        </div>
        <div class="form-group">
          <label>負責人姓名:</label>
          <input v-model="editedStore.contactPerson" />
        </div>
        <div class="form-group">
          <label>聯絡電話:</label>
          <input v-model="editedStore.phone" />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="editedStore.email" type="email" />
        </div>
        <div class="form-group">
          <label>狀態:</label>
          <select v-model="editedStore.status">
            <option value="啟用">啟用</option>
            <option value="停用">停用</option>
            <option value="審核中">審核中</option>
          </select>
        </div>
        <div class="form-group">
          <label>加入日期:</label>
          <input v-model="editedStore.joinDate" type="date" />
        </div>
        <div class="edit-actions">
          <button @click="saveEditing" class="action-btn save-btn">儲存</button>
          <button @click="cancelEditing" class="action-btn cancel-btn">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 成功訊息 -->
    <div v-if="showSuccessMessage" class="alert alert-success position-fixed" style="top: 20px; right: 20px; z-index: 1050; min-width: 300px;">
      <i class="bi bi-check-circle me-2"></i>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 不再需要 useCategories

// TODO: 之後要串接 API，現在用假資料
type Store = {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  status: string
  orderCount: number
  joinDate: string
  logo?: string // 商家LOGO網址
  ubnid?: string // 商家統編
}

const stores = ref<Store[]>([
  {
    id: 'S001',
    name: '測試店家A',
    contactPerson: '王小明',
    phone: '0912345678',
    email: 'testA@example.com',
    status: '啟用',
    orderCount: 120,
    joinDate: '2023-01-15',
    logo: 'https://placehold.co/60x60?text=A',
    ubnid: '12345678',
  },
  {
    id: 'S002',
    name: '測試店家B',
    contactPerson: '陳小華',
    phone: '0923456789',
    email: 'testB@example.com',
    status: '停用',
    orderCount: 50,
    joinDate: '2023-03-20',
    logo: 'https://placehold.co/60x60?text=B',
    ubnid: '87654321',
  },
  {
    id: 'S003',
    name: '測試店家C',
    contactPerson: '林小美',
    phone: '0934567890',
    email: 'testC@example.com',
    status: '審核中',
    orderCount: 0,
    joinDate: '2024-06-01',
    logo: '',
    ubnid: '',
  },
])
const keywordSearch = ref('')
const statusFilter = ref('全部')
const dateStartFilter = ref('')
const selectedStore = ref<Store | undefined>(undefined)
const newStore = ref({ name: '', contactPerson: '', phone: '', email: '' })
const displayedStores = ref<Store[]>([])
const isEditing = ref(false)
const editedStore = ref<Store | undefined>(undefined)
const showSuccessMessage = ref(false)
const successMessage = ref('')
// 移除 categoryFilter 相關

const searchStores = () => {
  let current = stores.value
  if (keywordSearch.value) {
    const kw = keywordSearch.value.toLowerCase()
    current = current.filter(s => s.name.toLowerCase().includes(kw) || s.phone.includes(kw) || s.email.toLowerCase().includes(kw))
  }
  if (statusFilter.value !== '全部') {
    current = current.filter(s => s.status === statusFilter.value)
  }
  if (dateStartFilter.value) {
    current = current.filter(s => new Date(s.joinDate) >= new Date(dateStartFilter.value))
  }
  displayedStores.value = current
}

const clearFilters = () => {
  keywordSearch.value = ''
  statusFilter.value = '全部'
  dateStartFilter.value = ''
  searchStores()
}

onMounted(() => {
  // 檢查 URL 參數中是否有新商家資料
  const urlParams = new URLSearchParams(window.location.search)
  const newStoreParam = urlParams.get('newStore')
  
  if (newStoreParam) {
    try {
      const newStore = JSON.parse(decodeURIComponent(newStoreParam))
      stores.value.unshift(newStore) // 將新商家添加到列表開頭
      console.log('新商家已添加：', newStore.name)
      
      // 顯示成功訊息
      successMessage.value = `商家「${newStore.name}」新增成功！`
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
      
      // 清除 URL 參數
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    } catch (error) {
      console.error('解析新商家資料失敗：', error)
    }
  }
  
  searchStores()
})

function addStore() {
  const s = newStore.value
  if (!s.name || !s.contactPerson || !s.phone || !s.email) return alert('請填寫所有欄位')
  stores.value.push({
    id: `S${Date.now().toString().slice(-4)}`,
    ...s,
    status: '審核中',
    orderCount: 0,
    joinDate: new Date().toISOString().slice(0, 10),
    logo: '', // 新增商家時LOGO為空
    ubnid: '', // 新增商家時統編為空
  })
  newStore.value = { name: '', contactPerson: '', phone: '', email: '' }
  searchStores()
}

function selectStore(store: Store) {
  console.log('selectStore called with:', store)
  selectedStore.value = store
  isEditing.value = false
}

function startEditing() {
  isEditing.value = true
  editedStore.value = { ...selectedStore.value } as Store
}

function saveEditing() {
  if (!editedStore.value) return
  const edited = editedStore.value
  const idx = stores.value.findIndex(s => s.id === edited.id)
  if (idx !== -1) {
    // TODO: 之後要串接 API，更新商家資料（含LOGO與統編）
    stores.value[idx] = { ...edited }
    selectedStore.value = stores.value[idx]
    isEditing.value = false
    searchStores()
  }
}

function cancelEditing() {
  isEditing.value = false
  editedStore.value = undefined
}

function deleteStore(id: string) {
  if (confirm('確定要刪除嗎？')) {
    stores.value = stores.value.filter(s => s.id !== id)
    selectedStore.value = undefined
    isEditing.value = false
    searchStores()
  }
}



function handleView(store: Store) {
  selectStore(store)
}

function toggleStoreStatus(store : Store) {
  // 在啟用和停用之間切換，審核中狀態保持不變
  if (store.status === '啟用') {
    store.status = '停用'
  } else if (store.status === '停用') {
    store.status = '啟用'
  }
  // 審核中狀態不變
  console.log(`商家「${store.name}」狀態已更新為：${store.status}`)
}

function handleDelete(id : string) {
  deleteStore(id)
}

function closeDetails() {
  selectedStore.value = undefined
  isEditing.value = false
  editedStore.value = undefined
}

function getStatusBadge(status: string ) {
  switch (status) {
    case '啟用':
      return 'badge bg-success'
    case '停用':
      return 'badge bg-secondary'
    case '審核中':
      return 'badge bg-warning'
    default:
      return 'badge bg-info'
  }
}
</script>

<style scoped>
.add-store-form {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

.add-store-form .input-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.add-store-form input {
  flex: 1;
  min-width: 120px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: var(--font-family-main);
}

.add-store-form button[type="submit"] {
  align-self: flex-end;
  width: auto;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  box-shadow: 0 1px 4px 0 rgba(44, 62, 80, 0.08);
  padding: 10px 18px;
  font-weight: 600;
  transition: background 0.18s;
}

.add-store-form button[type="submit"]:hover {
  background: var(--color-primary-dark);
}

.store-details-card {
  margin-top: 30px;
  padding: 24px 18px;
  background-color: #fff;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  border-left: 5px solid var(--color-primary);
  font-family: var(--font-family-main);
}

.store-details-card h3 {
  color: var(--color-primary);
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.close-btn {
  background: var(--color-text-light);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.close-btn:hover {
  background: #6c757d;
}

.store-details-card p {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 1.05em;
}

.store-details-card p strong {
  color: #555;
  margin-right: 5px;
}

@media (max-width: 991px) {
  .add-store-form .input-fields {
    flex-wrap: wrap;
  }
  .add-store-form input {
    min-width: 100px;
  }
}
/* 狀態徽章樣式調整 */
.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
  display: inline-block;
  min-width: 60px;
  text-align: center;
}

/* 表格狀態欄位樣式 */
.table td .badge {
  margin: 0;
  line-height: 1.2;
}

@media (max-width: 767px) {
  .management-card, .store-details-card {
    padding: 10px 2px;
  }
  .add-store-form {
    flex-direction: column;
    gap: 6px;
    padding: 8px;
  }
  .add-store-form .input-fields {
    flex-direction: column;
    gap: 6px;
  }
  .add-store-form input {
    min-width: 80px;
  }
  .table-container {
    font-size: 0.95em;
  }
  th, td {
    padding: 8px 6px;
  }
  .btn-group.btn-group-sm {
    flex-direction: column;
    gap: 2px;
  }
  .btn-group.btn-group-sm .btn {
    margin-bottom: 0.25rem;
  }
  
  /* 移動版狀態徽章調整 */
  .badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
    min-width: 50px;
  }
}

</style>