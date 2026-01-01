<script setup lang="ts">
definePageMeta({
  layout: "backend", // 強制使用 backend.vue
  middleware: "admin",
});
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">控制台概覽</h1>
      <p class="text-gray-500">歡迎回來，這是您今天的數據摘要。</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard v-for="i in 3" :key="i" class="hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-indigo-50 rounded-full">
            <UIcon
              name="i-lucide-trending-up"
              class="w-6 h-6 text-indigo-600"
            />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">總訪問量</p>
            <p class="text-2xl font-bold">1,28{{ i }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div
      class="bg-white rounded-xl border border-dashed border-gray-300 h-96 flex items-center justify-center text-gray-400"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-layout-dashboard"
          class="w-12 h-12 mx-auto mb-2 opacity-20"
        />
        <p>在這裡開始建立您的後台功能組件 ✨</p>
      </div>
    </div>
  </div>
</template>
