<template>
  <div class="flex h-screen bg-[#fafaf9] text-gray-800 antialiased overflow-hidden font-sans">

    <div class="lg:hidden fixed bottom-6 right-6 z-50">
      <UButton icon="i-lucide-layers" size="xl" color="black" class="rounded-full shadow-2xl"
        @click="isSidebarOpen = !isSidebarOpen" />
    </div>

    <aside :class="[
      'fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]',
      'lg:static lg:translate-x-0 bg-white/60 backdrop-blur-xl border-r border-gray-100',
      isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
    ]">
      <div class="h-20 flex items-center px-8">
        <div class="flex items-center gap-2 group cursor-pointer">
          <div class="w-2 h-6 bg-black rounded-full group-hover:scale-y-125 transition-transform"></div>
          <span class="text-lg font-bold tracking-tighter uppercase">X.Chic Studio</span>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <UNavigationMenu orientation="vertical" :items="menuItems" class="w-full" :ui="{
          list: 'gap-y-0.5',
          item: {
            base: 'relative flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium rounded-xl transition-all',
            active: 'text-black before:absolute before:left-[-16px] before:w-1 before:h-6 before:bg-black before:rounded-r-full bg-gray-100/50',
            inactive: 'text-gray-500 hover:text-black hover:bg-gray-100/30',
            icon: {
              base: 'w-[18px] h-[18px]',
              active: 'text-black',
              inactive: 'text-gray-400 group-hover:text-black'
            },
            label: 'tracking-tight'
          }
        }" />
      </div>

      <div class="p-4 mt-auto">
        <div class="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center gap-3">
          <UAvatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Snowball"
            class="w-8 h-8 rounded-lg shadow-sm" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-gray-900 truncate">Admin</p>
            <p class="text-[10px] text-gray-400 truncate">Workspace Free</p>
          </div>
          <UButton variant="ghost" color="gray" icon="i-lucide-log-out" size="xs" @click="auth.logout()" />
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col relative overflow-hidden">
      <header class="h-20 flex items-center justify-between px-10 flex-shrink-0">
        <div class="flex items-center gap-4">
          <h1 class="text-sm font-semibold text-gray-400 uppercase tracking-widest">Dashboard</h1>
          <span class="text-gray-200">/</span>
          <span class="text-sm font-medium">Overview</span>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden md:flex items-center px-3 py-1.5 bg-gray-100 rounded-lg text-gray-400 text-xs gap-2">
            <UKbd>⌘</UKbd>
            <UKbd>K</UKbd> <span>Search...</span>
          </div>
          <UChip text="3" size="2xl">
            <UButton icon="i-lucide-bell" variant="ghost" color="gray" />
          </UChip>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto px-10 pb-10">
        <div class="animate-in fade-in slide-in-from-bottom-2 duration-700">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~~/stores/auth';

const isSidebarOpen = ref(false);
const auth = useAuthStore();
const { menuItems } = useAdminMenu();
</script>

<style scoped>
/* 隱藏捲軸但保留功能 (可選) */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 簡單的微互動 */
.animate-in {
  animation-fill-mode: both;
}
</style>