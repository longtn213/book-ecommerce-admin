// src/services/book.ts
import axiosInstance from '../utils/axiosInstance';

const BOOK_API = '/admin/books';
const EBOOK_API = '/admin/ebooks';


// 🟢 Lấy danh sách sách (filter + pagination)
export const getBooks = async (params?: any) => {
  const res = await axiosInstance.get('/books', { params });
  return res.data;
};

// 🟢 Lấy chi tiết sách
export const getBookById = async (id: number | string) => {
  const res = await axiosInstance.get(`${BOOK_API}/${id}`);
  return res.data;
};

// 🟢 Thêm sách mới
export const createBook = async (payload: any) => {
  const res = await axiosInstance.post(BOOK_API, payload);
  return res.data;
};

// 🟢 Cập nhật sách
export const updateBook = async (id: number | string, payload: any) => {
  const res = await axiosInstance.put(`${BOOK_API}/${id}`, payload);
  return res.data;
};

// 🟢 Xóa sách
export const deleteBook = async (id: number | string) => {
  const res = await axiosInstance.delete(`${BOOK_API}/${id}`);
  return res.data;
};
