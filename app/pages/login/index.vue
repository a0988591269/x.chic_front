<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200">
    <div class="bg-white px-8 py-10 rounded-2xl shadow-2xl min-w-[320px] max-w-[90vw] flex flex-col items-stretch">
      <h2 class="text-center mb-6 text-gray-800 font-bold tracking-widest text-2xl">{{ isLogin ? '登入' : '註冊' }}</h2>
      <form @submit.prevent="handleSubmit" class="grid gap-4">
        <div class="flex flex-col gap-1">
          <label for="email" class="text-gray-600 text-base">電子郵件</label>
          <input id="email" v-model="form.email" type="email" required autocomplete="username"
            class="px-4 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-300 transition" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="password" class="text-gray-600 text-base">密碼</label>
          <input id="password" v-model="form.password" type="password" required autocomplete="current-password"
            class="px-4 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-orange-300 transition" />
        </div>
        <button
          class="bg-gradient-to-r from-yellow-300 to-pink-400 text-white rounded-lg py-2 font-semibold text-lg mt-2 hover:from-pink-400 hover:to-yellow-300 transition w-28 justify-self-center shadow"
          type="submit">
          {{ isLogin ? '登入' : '註冊' }}
        </button>
      </form>
      <div class="text-center mt-5 text-gray-500 text-base">
        <span>{{ isLogin ? '還沒有帳號？' : '已有帳號？' }}</span>
        <a href="#" @click.prevent="isLogin = !isLogin"
          class="text-pink-400 font-semibold underline ml-1 hover:text-yellow-500 transition">{{ isLogin ? '註冊' : '登入'
          }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '~~/stores/auth'

definePageMeta({
  // 使用 guest middleware 處理「已登入踢回首頁」的邏輯
  middleware: 'guest',
  // 標記為公開，配合 auth.global.ts 使用
  public: true
})

const isLogin = ref(false)
const form = ref({
  email: '',
  password: ''
})
// Submit 時轉成 FormData
async function handleSubmit() {
  // const fd = new ()
  // fd.append('Email', form.value.email)
  // fd.append('Password', form.value.password)
  // axios / $fetch
  const resp = await $fetch('https://localhost:7197/api/auth/login', {
    method: 'POST', body: {
      'Email': form.value.email,
      'Password': form.value.password
    }
  })
  console.log(resp, '登入成功')
  // const auth = useAuthStore()
  // auth.getUserInfo()
  // if (auth.isAuthenticated) {
  //   // const redirect = useRoute().query.redirect
  //   // navigateTo(Array.isArray(redirect) ? redirect[0] : redirect ?? '/')
  //   navigateTo("/");
  // }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>