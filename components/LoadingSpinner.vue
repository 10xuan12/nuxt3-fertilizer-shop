<template>
  <div v-if="show" class="loading-spinner" :class="[`loading-${size}`, `loading-${color}`]">
    <div class="spinner"></div>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'success' | 'warning'
  text?: string
}

withDefaults(defineProps<Props>(), {
  show: true,
  size: 'md',
  color: 'primary',
  text: ''
})
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  border: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-sm .spinner {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.loading-md .spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-lg .spinner {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.loading-primary .spinner {
  border-top-color: var(--color-primary);
}

.loading-white .spinner {
  border-top-color: #fff;
}

.loading-success .spinner {
  border-top-color: var(--color-success);
}

.loading-warning .spinner {
  border-top-color: var(--color-warning);
}

.loading-text {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 