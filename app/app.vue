<template>
  <div>
    <NuxtLayout>
      <NuxtPage v-if="auth.isAuthenticated" />
      <div v-else class="loading-container"></div>
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";
const auth = useAuthStore();
// 使用 onBeforeMount 確保在 SSR/Client 掛載前就發起身分檢查
onBeforeMount(async () => {
  if (!auth.isAuthenticated) {
    await auth.checkAuth();
  }
});
</script>
