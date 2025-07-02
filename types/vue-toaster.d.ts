// types/vue-toaster.d.ts
export {}

declare module '#app' {
  interface NuxtApp {
    $toast: {
      success: (msg: string, options?: any) => void
      error: (msg: string, options?: any) => void
      info: (msg: string, options?: any) => void
      warning: (msg: string, options?: any) => void
    }
  }
}
declare module '@meforma/vue-toaster' {
  import { Plugin } from 'vue'
  const plugin: Plugin
  export default plugin

  export function createToaster(options?: ToastOptions): {
    success: (message: string, options?: ToastOptions) => void
    error: (message: string, options?: ToastOptions) => void
    info: (message: string, options?: ToastOptions) => void
    warning: (message: string, options?: ToastOptions) => void
    show: (message: string, options?: ToastOptions) => void
    clear: () => void
  }
}

