import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  // 已登入者不准再進 login
  if (auth.isAuthenticated) {
    // 有上一頁 → 回去
    if (from.fullPath && from.fullPath !== "/login") {
      return navigateTo(from.fullPath);
    }

    // 沒上一頁 → 回首頁
    return navigateTo("/");
  }
});
