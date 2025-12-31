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
    user: null as UserInfo | null, // 只存 User Info，不存 Token
    isInitialized: false, // 關鍵狀態
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
      const api = useApi();
      try {
        // 這請求會自動帶 Cookie
        const data = await api.get<UserInfo>("/auth/userInfo");
        this.user = data;
      } catch {
        this.user = null;
      } finally {
        this.isInitialized = true;
      }
    },

    // 登入
    async login(loginData: { Email: string; Password: string }) {
      const api = useApi();
      try {
        await api.post("/auth/login", loginData);
        // 登入成功後立即獲取用戶資訊
        await this.checkAuth();
        return true;
      } catch (error) {
        console.error("登入請求失敗", error);
      }
    },

    // 登出
    async logout() {
      const api = useApi();
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("登出請求失敗", error);
      } finally {
        // 無論如何都清空狀態
        this.user = null;
        this.isInitialized = true;
        // 導航到登入頁
        navigateTo("/login");
      }
    },
  },
});
