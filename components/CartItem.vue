<template>
  <div class="flex items-center border-b py-4">
    <img :src="props.item?.image || '/placeholder-images-image_large.webp'" :alt="props.item?.name" class="w-16 h-16 object-cover rounded mr-4" />
    <div class="flex-1">
      <div class="font-bold text-gray-800">{{ props.item?.name }}</div>
      <div class="text-gray-600 text-sm">單價：NT$ {{ props.item?.price }}</div>
      <div class="flex items-center mt-2">
        <button 
          @click="props.item && updateQuantity(props.item.quantity - 1)" 
          class="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
          :disabled="!props.item"
        >-</button>
        <span class="px-3">{{ props.item?.quantity ?? 0 }}</span>
        <button 
          @click="props.item && updateQuantity(props.item.quantity + 1)" 
          class="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
          :disabled="!props.item"
        >+</button>
      </div>
    </div>
    <div class="w-24 text-right">
      <div class="text-green-600 font-semibold">
        NT$ {{ props.item ? props.item.price * props.item.quantity : 0 }}
      </div>
      <button
        @click="props.item && $emit('remove', props.item.id)"
        class="text-red-500 text-xs mt-2 hover:underline"
        :disabled="!props.item"
      >移除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  item: Object
})
const emit = defineEmits(['update-quantity', 'remove'])

function updateQuantity(qty: number) {
  if (props.item) {
    emit('update-quantity', props.item.id, qty)
  }
}
</script>
