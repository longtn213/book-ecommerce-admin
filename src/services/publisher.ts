// src/services/publisher.ts
import axiosInstance from '../utils/axiosInstance';

const PUBLISHER_API = '/publishers';

/**
 * 🟢 Lấy danh sách nhà xuất bản
 */
export const getPublishers = async () => {
  const res = await axiosInstance.get(PUBLISHER_API);
  return res.data.data || res.data;
};

/**
 * 🟢 Tạo mới nhà xuất bản
 */
export const createPublisher = async (data: any) => {
  const res = await axiosInstance.post(PUBLISHER_API, data);
  return res.data.data || res.data;
};

/**
 * 🟢 Cập nhật nhà xuất bản
 */
export const updatePublisher = async (data: any) => {
  const res = await axiosInstance.put(PUBLISHER_API, data);
  return res.data.data || res.data;
};

/**
 * 🟢 Xóa nhà xuất bản theo ID
 */
export const deletePublisher = async (id: number) => {
  const res = await axiosInstance.delete(`${PUBLISHER_API}/${id}`);
  return res.data.data || res.data;
};
