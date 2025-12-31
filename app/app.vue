<template>
  <div>
    <NuxtLayout>
      <NuxtPage v-if="auth.isInitialized" />
      <div v-else class="initial-loading"></div>
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "~~/stores/auth";
const auth = useAuthStore();
// 使用 onBeforeMount 確保在 SSR/Client 掛載前就發起身分檢查
// onBeforeMount(async () => {
//   if (!auth.isInitialized) {
//     await auth.checkAuth();
//   }
// });
// 使用 callOnce 確保在伺服器端抓一次，客戶端直接復用結果，不再重抓
await callOnce(async () => {
  if (!auth.isInitialized) {
    await auth.checkAuth();
  }
});
</script>
