import { defineStore } from "pinia";

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
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,

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
        const api = useApi();
        this.user = await api.get<UserInfo>("/auth/userInfo");
      } catch {
        this.user = null;
      }
    },

    // 登入
    async login(loginData) {
      const api = useApi();
      await api.post("/auth/login", loginData);
    },

    // 登出
    async logout() {
      const api = useApi();
      await api.post("/auth/logout"); // 呼叫後端清除 Cookie
      this.user = null;
    },
  },
});
