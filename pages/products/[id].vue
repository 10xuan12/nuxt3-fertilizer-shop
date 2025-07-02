<template>
    <div>
      <h1>商品詳情頁</h1>
      <div>id: {{ $route.params.id }}</div>
    </div>
  </template>
  <script setup>
  import { useRoute } from 'vue-router'
  const $route = useRoute()
  </script>