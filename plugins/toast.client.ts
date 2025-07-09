import { defineNuxtPlugin } from "nuxt/app"

export default defineNuxtPlugin(() => {
  // 簡單的 toast 實現
  function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    // 建立 toast 元素
    const toast = document.createElement('div')
    toast.className = `toast toast-${type} fade-in`
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      padding: 1rem 1.5rem;
      border-left: 4px solid var(--color-${type});
      z-index: 9999;
      max-width: 300px;
      word-wrap: break-word;
      animation: slideInRight 0.3s ease-out;
    `
    
    // 根據類型設定顏色
    const colors = {
      success: 'var(--color-success)',
      error: 'var(--color-danger)',
      warning: 'var(--color-warning)',
      info: 'var(--color-info)'
    }
    
    toast.style.borderLeftColor = colors[type]
    toast.textContent = message
    
    // 加入關閉按鈕
    const closeBtn = document.createElement('button')
    closeBtn.innerHTML = '&times;'
    closeBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--color-text-light);
    `
    closeBtn.onclick = () => removeToast(toast)
    toast.appendChild(closeBtn)
    
    // 加入頁面
    document.body.appendChild(toast)
    
    // 自動移除
    setTimeout(() => {
      removeToast(toast)
    }, 3000)
  }
  
  function removeToast(toast: HTMLElement) {
    toast.style.animation = 'slideOutRight 0.3s ease-in'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }
  
  // 加入 CSS 動畫
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style')
    style.id = 'toast-styles'
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  return {
    provide: {
      toast: {
        success: (message: string) => showToast(message, 'success'),
        error: (message: string) => showToast(message, 'error'),
        warning: (message: string) => showToast(message, 'warning'),
        info: (message: string) => showToast(message, 'info'),
        show: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
          showToast(message, type)
        }
      }
    }
  }
}) 