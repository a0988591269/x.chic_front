import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  // 公開頁（login、403、404…）
  if (to.meta.public === true) {
    return;
  }

  // 未登入 → 丟去 login
  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }

  const requiredPermissions = to.meta.permissions as string[] | undefined;
  if (requiredPermissions) {
    const pass = requiredPermissions.every((p) => auth.hasPermission(p));
    if (!pass) {
      return navigateTo("/403");
    }
  }
});
