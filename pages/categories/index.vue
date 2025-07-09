<template>
  <div class="container py-4">
    <h1 class="mb-4">分類管理</h1>
    <div class="row g-2 mb-3 align-items-end">
      <div class="col-md-4">
        <input v-model="search" type="text" class="form-control" placeholder="搜尋分類名稱..." />
      </div>
      <div class="col-md-8 text-end">
        <button class="btn btn-main"><span class="me-1">➕</span>新增分類</button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table align-middle table-hover category-table">
        <thead>
          <tr>
            <th scope="col">排序</th>
            <th scope="col">分類名稱</th>
            <th scope="col">商品數量</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <draggable 
          tag="tbody" 
          :list="filteredCategories" 
          item-key="id" 
          @end="onDragEnd"
          handle=".drag-handle"
        >
          <template #item="{ element: cat, index }">
            <tr>
              <td class="drag-handle" style="cursor: grab;">
                <i class="bi bi-grip-vertical text-secondary"></i>
              </td>
              <td>{{ cat.name }}</td>
              <td>{{ cat.productCount }}</td>
              <td>
                <button class="btn btn-main btn-sm me-1">
                  <i class="bi bi-pencil me-1"></i>編輯
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="deleteCategory(cat.id)">
                  <i class="bi bi-trash me-1"></i>刪除
                </button>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// @ts-ignore
import Draggable from 'vuedraggable'

interface Category {
  id: number
  name: string
  productCount: number
}

const categories = ref<Category[]>([
  { id: 1, name: '有機', productCount: 12 },
  { id: 2, name: '複合', productCount: 8 },
  { id: 3, name: '速效', productCount: 5 },
])

const search = ref('')
const filteredCategories = computed(() => {
  if (!search.value) return categories.value
  return categories.value.filter(c => c.name.includes(search.value))
})

function onDragEnd() {
  // 拖曳後 categories 已自動更新
  console.log('分類順序已更新')
}

function deleteCategory(id: number) {
  if (confirm('確定要刪除這個分類嗎？')) {
    categories.value = categories.value.filter(c => c.id !== id)
  }
}
</script>

<style scoped>
.category-table {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 16px 0 rgba(44, 62, 80, 0.08);
  background: var(--color-bg);
}

.category-table thead {
  background: var(--color-primary);
  color: #fff;
}

.category-table tbody tr:hover {
  background: var(--color-secondary);
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

.drag-handle {
  user-select: none;
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

@media (max-width: 767px) {
  .category-table {
    font-size: 0.97rem;
  }
}
</style>
