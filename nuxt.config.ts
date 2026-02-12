import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  imports: {
    autoImport: true,
  },
  routeRules: {
    // 當前端打 /api/xxx 時，Nuxt Server 會幫你轉發到後端
    "/api/**": {
      proxy: `${process.env.NUXT_API_SECRET}/api/**`,
    },
  },
  // 定義環境變數(.env 的值會自動帶進來)
  runtimeConfig: {
    // 注意：這邊的值只有在伺服器端可以存取
    apiSecret: "",
    // 注意：這邊的值可以在伺服器端與客戶端存取
    public: {
      apiBase: "",
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
  icon: {
    // 定義伺服器端圖示庫，確保在 SSR 階段也能正常使用
    serverBundle: {
      collections: ["heroicons", "lucide"],
    },

    // 定義客戶端圖示庫，確保在客戶端渲染階段也能正常使用
    // 注意：如果你有使用自定義圖示庫，請確保 `includeCustomCollections` 設為 `true`
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },

    // 定義本地圖示庫，確保在開發階段也能正常使用
    localApiEndpoint: "/",
  },
});
