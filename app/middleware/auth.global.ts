import { el } from "element-plus/es/locale/index.mjs";
import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // 1. 確保狀態已初始化 (非常重要！)
  if (!auth.isAuthenticated) {
    await auth.checkAuth();
  }

  // 2. 「已登入」狀態下的特殊處理 (這段要放最前面)
  if (auth.isAuthenticated) {
    // 如果已登入還想去登入頁，直接踢走
    if (to.path === "/login") {
      return navigateTo("/", { replace: true }); // 使用 replace 防止使用者點擊「上一頁」回到登入頁
    }
    // 已登入者，後續權限檢查...
  }

  // 3. 「未登入」狀態下的處理
  if (!auth.isAuthenticated) {
    // 如果是「訪客專用 / 登入專用」或是登入頁，放行
    console.log("「訪客專用 / 登入專用」：", to.meta.requiresGuest);
    if (to.meta.requiresGuest === true || to.path === "/login") {
      return;
    }
    // 非公開頁面且未登入 -> 丟去 login
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // 4. 權限檢查 (此時必為已登入)
  const requiredPermissions = to.meta.permissions as string[] | undefined;
  if (requiredPermissions) {
    const pass = requiredPermissions.every((p) => auth.hasPermission(p));
    if (!pass) {
      return navigateTo("/403");
    }
  }
});
