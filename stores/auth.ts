import { defineStore } from "pinia";
import { api } from "@/utils/api";

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
    user: null as UserInfo | null,
    isLoaded: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,

    hasRole: (state) => (role: string) =>
      state.user?.roles.includes(role) ?? false,

    hasPermission: (state) => (perm: string) =>
      state.user?.permissions.includes(perm) ?? false,
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await api.get("/auth/userInfo");
        this.user = res.data;
      } catch {
        this.user = null;
      } finally {
        this.isLoaded = true;
      }
    },

    logout() {
      this.user = null;
    },
  },
});
