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
      state.user?.roles.includes(role.toLowerCase()) ?? false,

    hasPermission: (state) => (perm: string) =>
      state.user?.permissions.includes(perm.toLowerCase()) ?? false,
  },
  actions: {
    async checkAuth() {
      const api = useApi();

      // 解決 F5 在SSR階段 null 的問題
      if (import.meta.client) {
        const cachedUser = localStorage.getItem("auth_user");
        if (cachedUser) {
          try {
            this.user = JSON.parse(cachedUser);
          } catch {
            localStorage.removeItem("auth_user");
          }
        }
      }

      try {
        const resp = (await api.get<UserInfo | null>("/auth/userInfo")).data;

        if (resp) {
          // 將角色與權限轉成小寫，方便後續比對
          resp.roles = normalizeToLowerArray(resp.roles);
          resp.permissions = normalizeToLowerArray(resp.permissions);
          this.user = resp;
          if (import.meta.client) {
            localStorage.setItem("auth_user", JSON.stringify(resp));
          }
        } else {
          this.user = null;
          if (import.meta.client) {
            localStorage.removeItem("auth_user");
          }
        }
      } catch {
        this.user = null;
        if (import.meta.client) {
          localStorage.removeItem("auth_user");
        }
      } finally {
        this.isInitialized = true;
      }
    },

    // 登入
    async login(loginData: { Email: string; Password: string }) {
      const api = useApi();
      try {
        await api.post("/auth/login", loginData);
        // 登入成功後，checkAuth 會自動寫入 LocalStorage
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
        // 清空狀態
        this.user = null;
        this.isInitialized = true;
        if (import.meta.client) {
          localStorage.removeItem("auth_user");
        }
        navigateTo("/login");
      }
    },
  },
});

function normalizeToLowerArray(
  value: string | string[] | undefined | null
): string[] {
  if (!value) return [];
  return Array.isArray(value)
    ? value.map((v) => v.toLowerCase())
    : [value.toLowerCase()];
}
