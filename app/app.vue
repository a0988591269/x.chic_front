<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
const auth = useAuthStore();
// 這裡建議用 onBeforeMount 確保在組件掛載前完成數據對齊
onBeforeMount(async () => {
  await auth.checkAuth();
});
</script>