import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6868/api';
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