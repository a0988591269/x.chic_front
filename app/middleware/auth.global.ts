import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // 確保 user 資料載入
  if (!auth.isLoaded) {
    await auth.getUserInfo()
  }

  // 1. 防止無限循環：如果目標已經是登入頁，直接放行
  // 這樣 guest.middleware (在 login 頁面設定的) 才會接手處理已登入邏輯
  if (to.path === "/login") {
    return;
  }

  // 2. 公開頁（403、404 等，如果有設定 meta.public）
  if (to.meta.public === true) {
    return;
  }

  // 3. 未登入 → 丟去 login
  if (!auth.isAuthenticated) {
    // 這裡可以使用 abortNavigation() 或者 navigateTo
    // 建議帶上 redirect 參數，這樣登入後可以跳回原本想去的頁面
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // 4. 權限檢查
  const requiredPermissions = to.meta.permissions as string[] | undefined;
  if (requiredPermissions) {
    const pass = requiredPermissions.every((p) => auth.hasPermission(p));
    if (!pass) {
      return navigateTo("/403");
    }
  }
});
