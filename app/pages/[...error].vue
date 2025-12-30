<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-orange-100"
  >
    <div
      class="bg-white/80 backdrop-blur-md px-10 py-14 rounded-3xl shadow-xl flex flex-col items-center"
    >
      <h1
        class="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 mb-4 select-none"
      >
        404
      </h1>
      <p class="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
        找不到頁面
      </p>
      <p class="text-base md:text-lg text-gray-500 mb-8">
        很抱歉，您要找的頁面不存在或已被移除。
      </p>
      <NuxtLink to="/">
        <a
          class="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-pink-400 text-white font-semibold shadow hover:from-pink-400 hover:to-yellow-300 transition"
        >
          回到首頁
        </a>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { NuxtLink } from "#components";

definePageMeta({
  requiresGuest: true,
});

// definePageMeta({ layout: false })

// const error = useError()
// if (import.meta.server) {
//   error.value = createError({ statusCode: 404, statusMessage: 'Not Found' })
// }

useError(404, "Not Found");
</script>
