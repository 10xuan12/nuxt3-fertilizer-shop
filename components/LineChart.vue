<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
// @ts-ignore
import Chart from 'chart.js/auto'

const props = defineProps<{
  labels: string[]
  datasets: any[]
  options?: any
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function renderChart() {
  if (chart) chart.destroy()
  if (!canvasRef.value) return
  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: props.datasets
    },
    options: props.options || {}
  })
}

onMounted(renderChart)
watch(() => [props.labels, props.datasets, props.options], renderChart, { deep: true })
onBeforeUnmount(() => { if (chart) chart.destroy() })
</script> 