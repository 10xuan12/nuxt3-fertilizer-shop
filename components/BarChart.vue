<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { Chart, type ChartData, type ChartOptions } from 'chart.js'

// Chart.js v4 之後不再需要 registerables，直接使用 Chart 即可

const props = defineProps<{
  labels: string[]
  datasets: any[]
  options?: ChartOptions
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function renderChart() {
  if (chart) chart.destroy()
  if (!canvasRef.value) return
  chart = new Chart(canvasRef.value, {
    type: 'bar',
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