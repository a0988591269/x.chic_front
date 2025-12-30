import { useAuthStore } from "~~/stores/auth";

// 定義 HTTP 方法的型別，讓 TypeScript 提示你
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  // 內部核心請求函式
  const customFetch = async <T>(
    url: string,
    method: HttpMethod,
    body?: any
  ) => {
    return await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      method: method,
      body: body,
      // 關鍵：允許攜帶 Cookie
      credentials: "include",

      // Request 攔截器邏輯
      onRequest({ options }) {
        // 如果之後有 header 想要手動補也可以寫在這
        // options.headers = { ...options.headers, 'X-Custom-Header': 'Hello' }
      },

      // Response 攔截器邏輯
      onResponse({ response }) {
        return response._data;
      },

      // ResponseError 攔截器邏輯
      onResponseError({ response }) {
        // 💀 抓到 401 代表 Cookie 失效或被竄改
        if (response.status === 401) {
          console.warn("權限失效，自動登出...");

          // 呼叫 Pinia 的登出動作 (清空 State)
          authStore.logout();
        }
      },
    });
  };

  // 把它整理成物件回傳，讓外部可以用 api.get, api.post
  return {
    get: <T>(url: string) => customFetch<T>(url, "GET"),
    post: <T>(url: string, body?: any) => customFetch<T>(url, "POST", body),
    put: <T>(url: string, body?: any) => customFetch<T>(url, "PUT", body),
    delete: <T>(url: string) => customFetch<T>(url, "DELETE"),
  };
};
