// plugins/auth.client.ts
import { useAuthStore } from "~~/stores/auth";

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()

  // 有 token 才撈 user（避免無限 401）
  if (!auth.isLoaded) {
    await auth.getUserInfo()
  }
})