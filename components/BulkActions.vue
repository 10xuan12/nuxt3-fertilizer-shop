<template>
  <div v-if="selectedItems.length > 0" class="bulk-actions">
    <div class="bulk-actions-bar">
      <div class="bulk-info">
        <span class="selected-count">已選擇 {{ selectedItems.length }} 項</span>
        <button type="button" class="btn-clear" @click="clearSelection">
          清除選擇
        </button>
      </div>
      
      <div class="bulk-buttons">
        <div class="dropdown">
          <button 
            class="btn btn-outline-primary dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            :disabled="loading"
          >
            <i class="bi bi-gear me-2"></i>批量操作
          </button>
          <ul class="dropdown-menu">
            <li>
              <button 
                class="dropdown-item" 
                @click="bulkUpdateStatus('active')"
                :disabled="loading"
              >
                <i class="bi bi-check-circle text-success me-2"></i>啟用
              </button>
            </li>
            <li>
              <button 
                class="dropdown-item" 
                @click="bulkUpdateStatus('inactive')"
                :disabled="loading"
              >
                <i class="bi bi-pause-circle text-danger me-2"></i>停用
              </button>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <button 
                class="dropdown-item text-danger" 
                @click="showDeleteConfirm"
                :disabled="loading"
              >
                <i class="bi bi-trash me-2"></i>批量刪除
              </button>
            </li>
          </ul>
        </div>
        
        <button 
          class="btn btn-danger" 
          @click="showDeleteConfirm"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" size="sm" color="white" />
          <i v-else class="bi bi-trash me-2"></i>
          刪除選擇
        </button>
      </div>
    </div>
    
    <!-- 確認對話框 -->
    <ConfirmDialog
      :show="showConfirm"
      title="確認批量刪除"
      message="您確定要刪除選中的項目嗎？此操作無法復原。"
      :details="`將刪除 ${selectedItems.length} 個項目`"
      type="delete"
      confirm-text="確認刪除"
      :loading="loading"
      @confirm="confirmDelete"
      @close="showConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import ConfirmDialog from './ConfirmDialog.vue'

interface Props {
  selectedItems: any[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'clear-selection': []
  'bulk-delete': [items: any[]]
  'bulk-update-status': [items: any[], status: string]
}>()

const showConfirm = ref(false)

function clearSelection() {
  emit('clear-selection')
}

function showDeleteConfirm() {
  showConfirm.value = true
}

async function confirmDelete() {
  emit('bulk-delete', props.selectedItems)
  showConfirm.value = false
}

function bulkUpdateStatus(status: string) {
  emit('bulk-update-status', props.selectedItems, status)
}
</script>

<style scoped>
.bulk-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

.bulk-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing) var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: var(--spacing);
}

.selected-count {
  font-weight: 600;
  color: var(--color-text);
}

.btn-clear {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.btn-clear:hover {
  color: var(--color-primary-dark);
}

.bulk-buttons {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.dropdown-menu {
  min-width: 200px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: var(--color-bg);
}

.dropdown-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dropdown-item.text-danger:hover {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .bulk-actions-bar {
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }
  
  .bulk-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .bulk-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .bulk-buttons .btn {
    flex: 1;
  }
}
</style> 