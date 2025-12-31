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

      // [Step 1] 優先從 LocalStorage 恢復資料 (Client 端專用)
      // 這能讓使用者感覺「資料還在」，解決 F5 瞬間變成 null 的問題
      if (import.meta.client) {
        const cachedUser = localStorage.getItem("auth_user");
        if (cachedUser) {
          try {
            this.user = JSON.parse(cachedUser);
          } catch (e) {
            console.error("解析快取失敗", e);
            localStorage.removeItem("auth_user");
          }
        }
      }

      try {
        // [Step 2] 發送 API 請求獲取最新資料 (背景驗證)
        const data = await api.get<UserInfo>("/auth/userInfo");

        // [Step 3] API 成功，更新 State 並同步寫入 LocalStorage
        this.user = data;
        if (import.meta.client) {
          localStorage.setItem("auth_user", JSON.stringify(data));
        }
      } catch (error) {
        // [Step 4] API 失敗 (例如 Cookie 過期)，清空 State 與 LocalStorage
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

        // 🛠️ 記得一併清除 LocalStorage
        if (import.meta.client) {
          localStorage.removeItem("auth_user");
        }

        navigateTo("/login");
      }
    },
  },
});
