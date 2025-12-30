import axios from "axios";
import { useAuthStore } from "~~/stores/auth";

const config = useRuntimeConfig();
const api = axios.create({
  baseURL: config.public.apiBase,
  withCredentials: true,    // 讓 Axios 請求自動攜帶 Cookie
  timeout: 10000,           // 可根據需求調整超時時間
});

// --- Request 攔截器：發送請求前注入 Token ---
// 目前走 HttpOnly Cookie，此段可視需求保留或刪除
api.interceptors.request.use(
  (config) => {
    // const auth = useAuthStore();
    // // 假設你的 Token 存在 Pinia 或是 Cookie
    // const token = auth.token;

    // if (token) {
    //   // 在 Header 注入 Authorization，確保後端不會因為 401 噴 CORS 錯
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response 攔截器：處理回傳資料與異常狀態 ---
api.interceptors.response.use(
  (response) => {
    // 直接回傳 data，減少組件端解構的負擔
    return response.data;
  },
  async (error) => {
    const auth = useAuthStore();

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

export default api;
