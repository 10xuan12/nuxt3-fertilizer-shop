import { defineNuxtConfig } from "nuxt/config";

// nuxt.config.ts
export default defineNuxtConfig({
  // 開發設定
  devtools: { enabled: true },
  
  // CSS 和 JS
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/main.css'
  ],
  
  // TypeScript 設定
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // 應用程式設定
  app: {
    head: {
      title: '肥料電商後台管理',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '專業的肥料電商後台管理系統' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          defer: true
        }
      ]
    }
  },
  
  // 模組
  modules: [],
  
  // 建置設定
  build: {
    transpile: ['bootstrap']
  },
  
  // 執行時設定
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000/api'
    }
  },
  
  // Nitro 設定
  nitro: {
    compatibilityDate: '2025-07-09'
  }
})