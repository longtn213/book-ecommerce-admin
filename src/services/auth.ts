// src/services/auth.ts
import axiosInstance from '../utils/axiosInstance';
import { UpdateUserPayload } from '../sections/user/UserEditModal';

// ------------------ AUTH ------------------

// 🟢 Đăng nhập
export const loginApi = async (username: string, password: string) => {
  const res = await axiosInstance.post('/auth/login', { username, password });
  return res.data; // { token, user }
};

// 🟢 Quên mật khẩu
export const forgotPasswordApi = async (email: string, domain:string) => {
  const res = await axiosInstance.post('/auth/forgot-password', { email,domain });
  return res.data;
};

// 🟢 Đặt lại mật khẩu
export const resetPasswordApi = async (token: string, newPassword: string) => {
  const res = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
  });
  return res.data;
};

// ------------------ ADMIN USER ------------------

// 🟢 Lấy danh sách admin user
export const getAdminUsers = async () => {
  const res = await axiosInstance.get('/admin/users');
  return  res.data;
};

// 🟢 Tạo admin user
export const createAdminUser = async (payload: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await axiosInstance.post('/admin/users', payload);
  return  res.data;
};

// 🟢 Cập nhật admin user
export const updateAdminUser = async (data: UpdateUserPayload) => {
  const res = await axiosInstance.put('/admin/users', data);
  return  res.data;
};
