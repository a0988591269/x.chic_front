import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // 1. 確保狀態已初始化 (非常重要！)
  if (!auth.isInitialized) {
    await auth.checkAuth();
  }

  console.log("已登入狀態下的特殊處理：", auth.isAuthenticated);
  console.log("目標頁面的 Meta 資訊：", to.meta);
  console.log("目標頁面的路徑：", to.path);

  // 2. 「已登入」且強行進入 /login
  if (auth.isAuthenticated && to.path === "/login") {
    console.log("偵測到已登入身分，強制從 /login 導回首頁");
    return navigateTo("/", { replace: true }); // 使用 replace 防止使用者點擊「上一頁」回到登入頁
  }

  // 3. 「未登入」且該頁面不是公開頁面
  if (!auth.isAuthenticated && to.path !== "/login" && !to.meta.requiresGuest) {
    return navigateTo("/login");
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
