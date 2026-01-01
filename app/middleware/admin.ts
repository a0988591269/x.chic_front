import { useAuthStore } from "~~/stores/auth";

// middleware/admin.ts
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();

  // 1. 如果沒登入 -> 踢回登入頁
  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }

  // 2. 如果有登入，但不是 Admin (權限不足) -> 踢回首頁 (Frontend default)
  if (!auth.hasRole("admin")) {
    // 這裡可以加個 Toast 提示： "Permission Denied!"
    return navigateTo("/");
  }

  // 3. 通過驗證 -> 放行 (不需要特別寫什麼，直接放行就好)
});
