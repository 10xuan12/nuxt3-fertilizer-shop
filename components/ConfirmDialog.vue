<template>
  <div v-if="show" class="confirm-dialog-overlay" @click="handleOverlayClick">
    <div class="confirm-dialog" @click.stop>
      <div class="dialog-header">
        <h5 class="dialog-title">
          <i :class="iconClass" class="me-2"></i>
          {{ title }}
        </h5>
        <button type="button" class="btn-close" @click="$emit('close')">
          <span>&times;</span>
        </button>
      </div>
      <div class="dialog-body">
        <p class="dialog-message">{{ message }}</p>
        <div v-if="details" class="dialog-details">
          {{ details }}
        </div>
      </div>
      <div class="dialog-footer">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="$emit('close')"
          :disabled="loading"
        >
          取消
        </button>
        <button 
          type="button" 
          :class="['btn', confirmButtonClass]" 
          @click="handleConfirm"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" size="sm" color="white" />
          <span v-else>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  show: boolean
  title: string
  message: string
  details?: string
  type?: 'delete' | 'confirm' | 'warning'
  confirmText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'confirm',
  confirmText: '確認',
  loading: false
})

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const iconClass = computed(() => {
  switch (props.type) {
    case 'delete': return 'bi bi-trash text-danger'
    case 'warning': return 'bi bi-exclamation-triangle text-warning'
    default: return 'bi bi-question-circle text-info'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'delete': return 'btn-danger'
    case 'warning': return 'btn-warning'
    default: return 'btn-main'
  }
})

function handleOverlayClick() {
  if (!props.loading) {
    emit('close')
  }
}

function handleConfirm() {
  emit('confirm')
}
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(4px);
}

.confirm-dialog {
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: dialogFadeIn 0.3s ease-out;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-light);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.dialog-body {
  padding: var(--spacing-lg);
}

.dialog-message {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
  line-height: 1.6;
}

.dialog-details {
  background: var(--color-bg);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  color: var(--color-text-light);
  border-left: 3px solid var(--color-primary);
}

.dialog-footer {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  padding: var(--spacing) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 768px) {
  .confirm-dialog {
    width: 95%;
    margin: var(--spacing);
  }
  
  .dialog-footer {
    flex-direction: column;
  }
  
  .dialog-footer .btn {
    width: 100%;
  }
}
</style> 