// src/services/order.ts
import axiosInstance from '../utils/axiosInstance';

const ORDER_API = '/admin/orders';

/**
 * 🟢 Lấy danh sách đơn hàng
 * Có hỗ trợ filter, search, phân trang (params)
 */
export const getOrders = async (params?: any) => {
  const res = await axiosInstance.get(ORDER_API, { params });
  return res.data;
};

/**
 * 🟢 Lấy chi tiết đơn hàng theo ID
 */
export const getOrderDetail = async (id: number) => {
  const res = await axiosInstance.get(`${ORDER_API}/${id}`);
  return res.data;
};

/**
 * 🟢 Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (id: number, status: string) => {
  const res = await axiosInstance.put(`${ORDER_API}/${id}/status`, {}, { params: { status } });
  return res.data;
};
