import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  // 標準 Claims（用 string literal 當 key）
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
    | string
    | string[];

  // 自訂 Claims
  user_uuid: string;
  tier: string;
  permission: string | string[];

  // JWT standard
  exp: number;
  iss: string;
  aud: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: "" as string,
    userId: "" as string,
    userName: "" as string,
    user_uuid: "" as string,
    tier: "" as string,
    roles: [] as string | string[],
    permissions: [] as string | string[],
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    hasRole: (state) => (role: string) => state.roles.includes(role),
    hasPermission: (state) => (perm: string) =>
      state.permissions.includes(perm),
  },

  actions: {
    setToken(token: string) {
      this.accessToken = token;
      const payload = jwtDecode<JwtPayload>(token);

      this.userId =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      this.userName =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      this.roles =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      this.user_uuid = payload.user_uuid;
      this.tier = payload.tier;
      this.permissions = payload.permission;
    },

    logout() {
      this.$reset();
    },
  },
});
