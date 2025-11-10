import axiosInstance from '../utils/axiosInstance';

const AUTHOR_API = '/authors';

// 🟢 Lấy danh sách tác giả
export const getAuthors = async () => {
  const res = await axiosInstance.get(AUTHOR_API);
  return res.data;
};

// 🟢 Tạo mới tác giả
export const createAuthor = async (data: any) => {
  const res = await axiosInstance.post(AUTHOR_API, data);
  return res.data;
};

// 🟢 Cập nhật tác giả
export const updateAuthor = async (data: any) => {
  const res = await axiosInstance.put(AUTHOR_API, data);
  return res.data;
};

// 🟢 Xóa tác giả
export const deleteAuthor = async (id: number) => {
  const res = await axiosInstance.delete(`${AUTHOR_API}/${id}`);
  return res.data;
};
