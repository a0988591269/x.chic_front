import { defineStore } from "pinia";
// import { useApi } from "@/composables/useApi";
import api from "@/utils/api";

interface UserInfo {
  userId: string;
  userUuid: string;
  userName: string;
  email: string;
  tier: string;
  roles: string | string[];
  permissions: string | string[];
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as UserInfo | null, // 我們只存 User Info，不存 Token
    isAuthenticated: false,
    isInitialized: false,
  }),
  getters: {
    hasRole: (state) => (role: string) =>
      state.user?.roles.includes(role) ?? false,

    hasPermission: (state) => (perm: string) =>
      state.user?.permissions.includes(perm) ?? false,
  },
  actions: {
    // F5 重新整理時呼叫這支
    async checkAuth() {
      try {
        // 這請求會自動帶 Cookie
        const userInfo = await api.get<UserInfo>("/auth/userInfo");
        this.user = userInfo;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.isInitialized = true;
      }
    },
    async login(loginData) {
      // Post 範例
      await api.post("/auth/login", loginData);
    },
    // 登出
    async logout() {
      const api = useApi();
      await api.post("/auth/logout"); // 呼叫後端清除 Cookie
      this.user = null;
      this.isAuthenticated = false;
      window.location.href = "/login";
    },
  },
});
