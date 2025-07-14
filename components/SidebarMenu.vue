<template>
  <ul class="nav flex-column sidebar-menu">
    <li class="nav-item mb-2">
      <NuxtLink to="/" class="nav-link sidebar-link" active-class="active">
        <i class="bi bi-speedometer2 me-2"></i>
        <span class="menu-text">主頁
        </span>
      </NuxtLink>
    </li>
    <li class="nav-item mb-2">
      <NuxtLink to="/stores" class="nav-link sidebar-link" active-class="active">
        <i class="bi bi-shop-window me-2"></i>
        <span class="menu-text">商家管理</span>
      </NuxtLink>
    </li>
    <li class="nav-item mb-2">
      <NuxtLink to="/products" class="nav-link sidebar-link" active-class="active">
        <i class="bi bi-box me-2"></i>
        <span class="menu-text">商品管理</span>
      </NuxtLink>
    </li>
    <li class="nav-item mb-2">
      <NuxtLink to="/categories" class="nav-link sidebar-link" active-class="active">
        <i class="bi bi-folder me-2"></i>
        <span class="menu-text">分類管理</span>
      </NuxtLink>
    </li>
    <li class="nav-item mb-2">
      <NuxtLink to="/orders" class="nav-link sidebar-link" active-class="active">
        <i class="bi bi-cart me-2"></i>
        <span class="menu-text">訂單管理</span>
      </NuxtLink>
    </li>
    <li class="nav-item mb-2">
      <NuxtLink to="/customers" class="nav-link sidebar-link" active-class="active">
        <i class="bi bi-people me-2"></i>
        <span class="menu-text">客戶管理</span>
      </NuxtLink>
    </li>
    <li class="nav-item mb-2">
      <NuxtLink to="/reports" class="nav-link sidebar-link" active-class="active">
        <i class="bi bi-graph-up me-2"></i>
        <span class="menu-text">報表分析</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.sidebar-menu {
  font-size: 1rem;
  font-weight: 500;
}

.sidebar-link {
  color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  text-decoration: none;
}

.sidebar-link .menu-text {
  margin-left: 0.5rem;
}

.sidebar-link:hover,
.sidebar-link:focus {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  transform: translateX(4px);
}

.sidebar-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-link i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

@media (max-width: 991px) {
  .sidebar-menu {
    font-size: 0.95rem;
  }
  
  .sidebar-link {
    padding: 0.6rem 0.8rem;
  }
}

/* 手機 offcanvas 側邊欄專用字色修正 */
.offcanvas .sidebar-link,
.offcanvas .sidebar-link.active,
.offcanvas .sidebar-link:hover,
.offcanvas .sidebar-link:focus,
.offcanvas .sidebar-link i,
.offcanvas .menu-text {
  color: #256b45 !important;
  background: #fff !important;
}

@media (max-width: 767px) {
  .sidebar-menu {
    font-size: 0.95rem;
  }
  .sidebar-link {
    padding: 0.6rem 0.8rem;
  }
  .sidebar-link,
  .sidebar-link.active,
  .sidebar-link:hover,
  .sidebar-link:focus {
    color: #256b45 !important;
    background: #fff !important;
  }
}
</style>
