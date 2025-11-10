// src/services/coupon.ts
import axiosInstance from '../utils/axiosInstance';

const COUPON_API = '/admin/coupons';

/**
 * 🟢 Lấy danh sách coupon (có thể lọc theo trạng thái, keyword, v.v. nếu BE hỗ trợ)
 */
export const getCoupons = async (params?: any) => {
  const res = await axiosInstance.get(COUPON_API, { params });
  return res.data;
};

/**
 * 🟢 Tạo coupon mới
 */
export const createCoupon = async (data: any) => {
  const res = await axiosInstance.post(COUPON_API, data);
  return res.data;
};

/**
 * 🟢 Cập nhật coupon (theo code hoặc id — tùy BE)
 */
export const updateCoupon = async (data: any) => {
  const res = await axiosInstance.put(COUPON_API, data);
  return res.data;
};

/**
 * 🟢 Xóa coupon theo code (hoặc id)
 */
export const deleteCoupon = async (code: string) => {
  const res = await axiosInstance.delete(COUPON_API, { params: { code } });
  return res.data;
};
