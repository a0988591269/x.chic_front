import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  imports: {
    autoImport: true,
  },
  css: [
    "~/assets/css/main.css",
    "~/assets/css/style.css",
    // Modify the `nuxt.config.ts` file by adding to the `export default defineNuxtConfig()`
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  ui: {
    colorMode: false
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