import axiosInstance from '../utils/axiosInstance';


export const getDashboardStats = async () => {
  const res = await axiosInstance.get('/admin/dashboard/stats');
  return res.data.data; // vì response có { success, message, data }
};
