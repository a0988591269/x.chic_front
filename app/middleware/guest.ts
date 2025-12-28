import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  // 已登入者不准再進 login
  if (auth.isAuthenticated) {
    // 嘗試從 query 參數中獲取原本想去的頁面 (配合 auth.global.ts 的 redirect 參數)
    const redirectPath = to.query.redirect as string;

    if (redirectPath) {
      return navigateTo(redirectPath);
    }

    // 如果是從其他頁面點連結過來的，就回去上一頁
    // 注意：from.path !== to.path 是為了避免同一頁刷新造成的誤判
    if (from.path && from.path !== "/login" && from.path !== to.path) {
      return navigateTo(from.fullPath);
    }

    // 預設回首頁
    return navigateTo("/");
  }
});
