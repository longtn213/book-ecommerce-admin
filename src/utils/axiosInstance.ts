// src/utils/axiosInstance.ts
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6868/api';

const axiosInstance = axios.create({
  baseURL: `${API_BASE}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🧩 Interceptor: tự động thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // hoặc sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧩 (tùy chọn) Interceptor xử lý lỗi 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token hết hạn hoặc không hợp lệ');
      // có thể redirect về trang login tại đây
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
