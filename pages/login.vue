<template>
  <div class="container py-5 d-flex justify-content-center align-items-center" style="min-height: 100vh;">
    <div class="card shadow p-4" style="max-width: 400px; width: 100%;">
      <h2 class="mb-4 text-center">登入</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">帳號（Email）</label>
          <input v-model="email" type="email" class="form-control" required placeholder="請輸入Email" />
        </div>
        <div class="mb-3 position-relative">
          <label class="form-label">密碼</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="form-control pr-5"
            required
            placeholder="請輸入密碼"
          />
          <i
            class="bi position-absolute end-0 me-3 cursor-pointer"
            :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
            style="right: 1rem; top: 70%; font-size: 1.2rem; z-index: 2; transform: translateY(-50%);"
            @click="showPassword = !showPassword"
            tabindex="0"
            @keydown.enter.prevent="showPassword = !showPassword"
            aria-label="切換密碼顯示"
          ></i>
        </div>
        <!-- reCAPTCHA 驗證區塊 -->
        <!--
        <div class="mb-3 text-center">
          <div id="recaptcha-container"></div>
        </div>
        -->
        <button type="submit" class="btn btn-main w-100 mb-3">登入</button>
      </form>
      <div class="text-center text-muted mb-2">或</div>
      <button class="btn btn-outline-danger w-100 mb-2 d-flex align-items-center justify-content-center gap-2" @click="handleGoogleLogin">
        <i class="bi bi-google"></i>
        使用 Google 帳號登入
      </button>
      <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMsg = ref('')
const router = useRouter()
// const recaptchaVerified = ref(false)
// const recaptchaToken = ref('')

declare global {
  interface Window {
    grecaptcha: any
  }
}

// onMounted(() => {
//   // 載入 Google reCAPTCHA v2 script
//   if (!window.grecaptcha) {
//     const script = document.createElement('script')
//     script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
//     script.async = true
//     script.onload = renderRecaptcha
//     document.head.appendChild(script)
//   } else {
//     renderRecaptcha()
//   }
// })

// function renderRecaptcha() {
//   // 請到 https://www.google.com/recaptcha/admin 申請 site key
//   // 這裡用測試 key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
//   window.grecaptcha.render('recaptcha-container', {
//     sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // TODO: 換成正式 key
//     callback: (token: string) => {
//       recaptchaVerified.value = true
//       recaptchaToken.value = token
//     },
//     'expired-callback': () => {
//       recaptchaVerified.value = false
//       recaptchaToken.value = ''
//     }
//   })
// }

function handleLogin() {
  // TODO: 串接後端 API 進行帳密驗證，並傳 recaptchaToken 一起送出
  // 1. POST /api/login { email, password, recaptchaToken }
  // 2. 後端需呼叫 Google reCAPTCHA 驗證 API：
  //    POST https://www.google.com/recaptcha/api/siteverify
  //    參數：secret, response（即 recaptchaToken），remoteip（可選）
  // 3. 驗證通過才允許登入，否則回傳錯誤
  // 假資料驗證（可改成實際 API）
  if (email.value === 'admin@test.com' && password.value === '123456') {
    router.push('/')
  } else {
    errorMsg.value = '（TODO）請串接後端登入 API 並驗證 reCAPTCHA，或帳密錯誤'
  }
}

function handleGoogleLogin() {
  // TODO: 串接 Google OAuth 登入
  // 1. 前端導向 Google OAuth 授權頁（可用 Google API JS SDK 或 window.location.href）
  // 2. Google 驗證成功後，取得 access_token 或 id_token
  // 3. 將 token 傳給後端 /api/auth/google，後端驗證並建立 session/JWT
  // 4. 前端收到成功回應後跳轉首頁
  // 5. 失敗則顯示錯誤訊息
  errorMsg.value = '（TODO）請串接 Google OAuth 登入流程'
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.btn-main {
  background: var(--color-primary-dark);
  color: #fff;
  font-weight: 600;
  border: none;
}
.btn-main:hover {
  background: var(--color-primary-dark);
}
</style>