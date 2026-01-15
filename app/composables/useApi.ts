import axios from "axios";
import { useAuthStore } from "~~/stores/auth";
import https from "https";

export const useApi = () => {
  // 只有在 function 被呼叫時才會執行，此時 Nuxt Instance 已經 Ready 了
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const toast = useToast();
  const isServer = import.meta.server; // 判斷是否在伺服器端執行
  // 關鍵：在 SSR 時抓取請求的 Cookie header
  const headers = useRequestHeaders(["cookie"]);

  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true, // 讓 Axios 請求自動攜帶 Cookie
    timeout: 10000, // 可根據需求調整超時時間
    // 只在開發環境的伺服器端禁用 SSL 驗證
    httpsAgent: isServer
      ? new https.Agent({
          rejectUnauthorized: false,
        })
      : undefined,
    headers: headers, // 將 Cookie 轉發給後端 API
  });

  // --- Request 攔截器 ---
  api.interceptors.request.use(
    (config) => {
      // const auth = useAuthStore();
      // // 假設你的 Token 存在 Pinia 或是 Cookie
      // const token = auth.token;

      // if (token) {
      // // 在 Header 注入 Authorization，確保後端不會因為 401 噴 CORS 錯
      //   config.headers.Authorization = `Bearer ${token}`;
      // }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // --- Response 攔截器 ---
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.add({ title: "error.response.data.error", color: "error" });
            break;
          case 401:
            // 401 代表 Cookie 失效或被竄改
            if (import.meta.client) {
              // 伺服器端直接返回
              auth.logout(); // 清除狀態
            }
            break;
          case 403:
            toast.add({ title: "你沒有權限執行此操作！", color: "warning" });
            break;
          case 404:
            navigateTo("/404");
            break;
          case 500:
            toast.add({ title: "系統忙碌中！", color: "error" });
            break;
        }
      } else {
        toast.add({ title: "網路 或 CORS 錯誤！", color: "error" });
      }

      return Promise.reject(error);
    }
  );

  return api;
};
