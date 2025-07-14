import { ref } from 'vue'

// TODO: 之後要串接後端 API，現在用假資料
const categories = ref([
  { id: 1, name: '化學肥料' },
  { id: 2, name: '有機肥料' },
  { id: 3, name: '生物性肥料（菌劑）' },
  { id: 4, name: '微量元素肥料' },
  { id: 5, name: '土壤改良劑' },
  { id: 6, name: '生物炭' }
])

export function useCategories() {
  // 之後這裡可以 fetch API
  // async function fetchCategories() {
  //   const res = await fetch('/api/categories')
  //   categories.value = await res.json()
  // }
  return { categories }
} 