import axios from 'axios';
import { UpdateUserPayload } from '../sections/user/UserEditModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6868/api';

export const loginApi = async (username: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
  return res.data; // giả sử response có { token, user }
};

export const forgotPasswordApi = async (email: string) =>
  axios.post(`${API_BASE}/auth/forgot-password`, { email });
export const resetPasswordApi = async (token: string, newPassword: string) => {
  return axios.post(`${API_BASE}/auth/reset-password`, {
    token,
    newPassword,
  });
};

export const getAdminUsers = async (token: string) => {
  const res = await axios.get(`${API_BASE}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createAdminUser = async (
  token: string,
  payload: { username: string; email: string; password: string; role: string }
) => {
  console.log('token: ', token);
  const res = await axios.post(`${API_BASE}/admin/users`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export async function updateAdminUser(token: string, data: UpdateUserPayload) {
  const res = await axios.put(`${API_BASE}/admin/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
/**
 * Lấy danh sách coupon (có thể lọc theo trạng thái nếu BE hỗ trợ)
 */
export const getCoupons = async (token: string) => {
  const res = await axios.get(`${API_BASE}/admin/coupons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

/**
 * Tạo coupon mới
 */
export const createCoupon = async (token: string, data: any) => {
  const res = await axios.post(`${API_BASE}/admin/coupons`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

/**
 * Cập nhật coupon (theo code)
 */
export const updateCoupon = async (token: string, data: any) => {
  const res = await axios.put(`${API_BASE}/admin/coupons`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

/**
 * Xoá coupon theo code
 */
export const deleteCoupon = async (token: string, code: string) => {
  const res = await axios.delete(`${API_BASE}/admin/coupons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { code },
  });
  return res.data;
};