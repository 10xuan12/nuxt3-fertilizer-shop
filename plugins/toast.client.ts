// plugins/toast.client.ts
import { createToaster } from '@meforma/vue-toaster'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp: { provide: (arg0: string, arg1: any) => void }) => {
  const toaster = createToaster({ position: 'top-right', duration: 2500 })
  nuxtApp.provide('toast', toaster)
})
