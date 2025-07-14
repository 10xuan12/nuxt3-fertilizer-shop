<template>
  <div>
    <!-- 📱 手機版導覽列 -->
    <nav class="navbar navbar-expand-lg bg-main d-lg-none px-3">
      <button class="btn btn-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
        <i class="bi bi-list"></i>
      </button>
      <span class="navbar-brand ms-3 text-white">肥料電商平台後台</span>
      
      <!-- 手機版使用者選單 -->
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle me-1"></i>管理員
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="profile"><i class="bi bi-person me-2"></i>個人資料</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout">
            <i class="bi bi-box-arrow-right me-2"></i>登出
          </a></li>
        </ul>
      </div>
    </nav>

    <!-- 🖥 桌機版側邊欄 -->
    <div class="d-none d-lg-block bg-main text-white p-3 vh-100 shadow-sm sidebar-fixed">
      <div class="fw-bold fs-4 mb-4 text-center">肥料電商平台後台</div>
      <SidebarMenu />
      
      <!-- 桌機版使用者選單 -->
      <div class="mt-auto pt-4 border-top border-light">
        <div class="dropdown">
          <button class="btn btn-outline-light w-100 dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle me-2"></i>管理員
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="profile"><i class="bi bi-person me-2"></i>個人資料</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout">
              <i class="bi bi-box-arrow-right me-2"></i>登出
            </a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 📱 手機 offcanvas 側邊欄 -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarMenu">
      <div class="offcanvas-header bg-main text-white justify-content-between align-items-center">
        <span class="fw-bold fs-5">肥料電商平台後台</span>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <SidebarMenu />
      </div>
    </div>

    <!-- 🧾 主內容區塊 -->
    <div :class="['main-content', 'p-4', 'ms-lg-240', 'content-bg']">
      <div class="content-inner mx-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarMenu from '../components/SidebarMenu.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  if (confirm('確定要登出嗎？')) {
    // 這裡可以加入登出邏輯
    console.log('使用者登出')
    // 跳轉到登入頁
    router.push('/login')
  }
}
</script>

<style scoped>
.ms-lg-240 {
  margin-left: 240px;
}

@media (max-width: 991px) {
  .ms-lg-240 {
    margin-left: 0;
  }
  .main-content {
    padding: 1.2rem !important;
  }
}

.sidebar-fixed {
  width: 240px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1030;
  box-shadow: 2px 0 8px 0 rgba(44, 62, 80, 0.06);
  display: flex;
  flex-direction: column;
}

.content-bg {
  min-height: 100vh;
  background: var(--color-bg);
}

.content-inner {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(44, 62, 80, 0.08);
  padding: 2.5rem 2rem;
  max-width: 1100px;
  min-height: 80vh;
}

@media (max-width: 767px) {
  .content-inner {
    padding: 1.2rem 0.5rem;
  }
}

.bg-main {
  background: var(--color-primary) !important;
}
</style>
