// src/utils/axiosInstance.ts
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6868/api';

const axiosInstance = axios.create({
  baseURL: `${API_BASE}`,
  headers: { 'Content-Type': 'application/json' },
});

// 🧩 Request Interceptor: thêm token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧩 Response Interceptor: xử lý lỗi 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⛔ Token hết hạn hoặc không hợp lệ');

      // Xóa token cũ để tránh lặp vô hạn
      localStorage.removeItem('token');

      // Redirect về trang login
      window.location.href = '/sign-in';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
