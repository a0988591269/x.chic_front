<template>
  <!-- Guide Bar -->
  <div class="h-[40px] bg-gray-200 flex items-center px-3">
    <!-- Left -->
    <div class="flex items-center gap-3">
      <!-- Home -->
      <NuxtLink
        to="/"
        class="w-[60px] h-[30px] flex items-center justify-center text-zinc-600"
      >
        首頁
      </NuxtLink>

      <!-- Search -->
      <div class="flex items-center gap-2">
        <button class="w-[16px] h-[16px]" @click="toggleCollapse">
          <img src="~/assets/image/search.png" />
        </button>

        <div
          class="flex items-center gap-2 transition-all duration-200"
          :class="
            isOpen ? 'w-[240px] opacity-100' : 'w-0 opacity-0 overflow-hidden'
          "
        >
          <input
            type="text"
            class="h-[30px] px-2 text-sm border border-gray-300 rounded"
            placeholder="請輸入查詢關鍵字"
          />
          <button
            class="h-[30px] px-3 text-sm text-zinc-600 border border-gray-300 rounded"
          >
            搜尋
          </button>
        </div>
      </div>
    </div>

    <!-- Right -->
    <div class="ml-auto flex items-center gap-2 min-w-[160px] justify-end">
      <template v-if="isLogin">
        <span class="text-zinc-600">
          {{ auth.user?.userName }}：{{ auth.user?.email }}
        </span>
      </template>
      <template v-if="isLogin && auth.hasRole('admin')">
        <NuxtLink to="/admin" class="text-zinc-600">後台</NuxtLink>
      </template>

      <NuxtLink
        to="/"
        class="w-[60px] h-[30px] flex items-center justify-center text-zinc-600"
      >
        購物車
      </NuxtLink>

      <template v-if="!isLogin">
        <NuxtLink to="/login" class="text-zinc-600">登入</NuxtLink>
        <span class="text-zinc-400">/</span>
        <NuxtLink to="/signup" class="text-zinc-600">註冊</NuxtLink>
      </template>

      <template v-else>
        <a
          href="javascript:void(0);"
          class="text-zinc-600"
          @click="auth.logout()"
        >
          登出
        </a>
      </template>
    </div>
  </div>
  <div>
    <NuxtLink to="/">
      <img
        src="~/assets/image/logo.png"
        alt="X.Chic creative studio"
        class="img-fluid justify-self-center"
      />
    </NuxtLink>
  </div>
  <div>
    <ul id="nav">
      <li v-for="item in resp" :key="item.categoryId" class="main_menu">
        <NuxtLink :to="`/categories/${item.slug}`">
          <span>{{ item.categoryName }}</span
          >{{ item.categoryEngName }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~~/stores/auth";
const auth = useAuthStore();
const isLogin = computed(() => auth.isAuthenticated);

interface Category {
  categoryId: number;
  categoryName: string;
  categoryEngName: string;
  description: string;
  slug: string;
}

const isOpen = ref(false);
const toggleCollapse = () => {
  isOpen.value = !isOpen.value;
  return isOpen.value;
};
const api = useApi();
const { data: resp } = (await api.get<Category[]>("/category"));
console.log(resp);
</script>
