import axiosInstance from "../utils/axiosInstance";

const CONTACT_API = "/admin/messages";

// GET danh sách
export const getMessages = async (params?: any) => {
  const res = await axiosInstance.get(CONTACT_API, { params });
  return res.data;
};

// UPDATE trạng thái
export const updateContactMessageStatus = async (id: number, status: string) => {
  const res = await axiosInstance.put(`/admin/messages/${id}/status`, null, {
    params: { status },
  });
  return res.data;
};
