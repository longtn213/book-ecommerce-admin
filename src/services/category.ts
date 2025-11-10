// src/services/category.ts
import axiosInstance from '../utils/axiosInstance';

const CATEGORY_API = '/categories';

// 🟢 Lấy danh sách category
export const getCategories = async () => {
  const res = await axiosInstance.get(CATEGORY_API);
  return res.data;
};

// 🟢 Tạo category mới
export const createCategory = async (data: any) => {
  const res = await axiosInstance.post(CATEGORY_API, data);
  return res.data;
};

// 🟢 Cập nhật category
export const updateCategory = async (data: any) => {
  const res = await axiosInstance.put(CATEGORY_API, data);
  return res.data;
};

// 🟢 Xóa category
export const deleteCategory = async (id: number) => {
  const res = await axiosInstance.delete(`${CATEGORY_API}/${id}`);
  return res.data;
};
