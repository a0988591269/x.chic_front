import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // ⭐ 讓 Cookie 自動帶上
})

// export default api