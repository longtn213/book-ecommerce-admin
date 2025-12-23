import axiosInstance from '../utils/axiosInstance';

/**
 * =============================
 * USER / ADMIN – GET EBOOK
 * =============================
 * GET /api/ebooks/by-book/{bookId}
 */
export const getEBookByBookId = async (bookId: number | string) => {
  const res = await axiosInstance.get(`/ebooks/by-book/${bookId}`);
  return res.data;
};

/**
 * =============================
 * ADMIN – UPLOAD EBOOK PDF
 * =============================
 * POST /api/admin/ebooks/upload-pdf?bookId={id}
 */
export const uploadEBookPdf = async (bookId: number | string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post(`/admin/ebooks/upload-pdf`, formData, {
    params: { bookId },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};
