import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  imports: {
    autoImport: true,
  },
  // 這是給 app/utils/api.ts 用的
  runtimeConfig: {
    public: {
      apiBase: "https://localhost:7197/api", // 請根據實際情況修改
    },
  },
  css: [
    "~/assets/css/main.css",
    "~/assets/css/style.css",
    // Modify the `nuxt.config.ts` file by adding to the `export default defineNuxtConfig()`
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  ui: {
    colorMode: false,
  },
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@pinia/nuxt",
  ],
});
