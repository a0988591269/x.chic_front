import axios from "axios";
import { useAuthStore } from "~~/stores/auth";
import https from "https";

export const useApi = () => {
  // ✅ 只有在 function 被呼叫時才會執行，此時 Nuxt Instance 已經 Ready 了
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const isServer = import.meta.server; // 判斷是否在伺服器端執行

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
      // 直接回傳 data，減少組件端解構的負擔
      return response.data;
    },
    async (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 💀 抓到 401 代表 Cookie 失效或被竄改
            auth.logout(); // 清除狀態並導向登入頁
            break;
          case 403:
            // TODO：403 相關處理
            break;
          case 500:
            // TODO：500 相關處理
            break;
        }
      } else {
        // TODO：網路錯誤或 CORS 錯誤處理
      }

      return Promise.reject(error);
    }
  );

  return api;
};
