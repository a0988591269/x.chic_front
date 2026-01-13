<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f4f4f3] px-4">
    <div
      class="bg-white px-8 py-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] w-full max-w-sm flex flex-col"
    >
      <h2
        class="text-center mb-8 text-gray-800 font-semibold tracking-[0.2em] text-xl"
      >
        登入
      </h2>

      <form @submit.prevent="login" class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm text-gray-500"> Email </label>
          <input
            id="email"
            v-model="form.Email"
            type="email"
            required
            autocomplete="username"
            class="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm text-gray-500"> 密碼 </label>
          <input
            id="password"
            v-model="form.Password"
            type="password"
            required
            autocomplete="current-password"
            class="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition"
          />
        </div>

        <button
          type="submit"
          class="mt-6 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-medium tracking-wider hover:bg-gray-700 active:bg-gray-900 transition"
        >
          SIGN IN
        </button>
      </form>

      <div class="text-center mt-6 text-sm text-gray-400">
        帳號切換：
        <button
          class="underline hover:text-gray-600 transition"
          @click="setAccount('admin')"
        >
          管理員
        </button>
        /
        <button
          class="underline hover:text-gray-600 transition"
          @click="setAccount('member')"
        >
          會員
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "~~/stores/auth";
import { ElMessage } from "element-plus";

definePageMeta({
  // 標記為「訪客專用 / 登入專用」，配合 auth.global.ts 使用
  requiresGuest: true,
});

const form = ref({
  Email: "",
  Password: "",
});

const login = async () => {
  const auth = useAuthStore();
  const islogin = await auth.login(form.value);

  if (islogin) {
    ElMessage.success("登入成功");
  } 
  // else {
  //   ElMessage.error("帳號或密碼錯誤");
  // }
};

const setAccount = (type: "admin" | "member") => {
  if (type === "admin") {
    form.value.Email = "admin@myapp.com";
    form.value.Password = "12345678";
  } else {
    form.value.Email = "customer@myapp.com";
    form.value.Password = "12345678";
  }
};
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
