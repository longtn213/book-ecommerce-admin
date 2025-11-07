import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6868/api';

export const getOrders = async (token: string,params: any) => {
  const res = await axios.get(`${API_BASE}/admin/orders`,{
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
export const getOrderDetail = async (token: string, id: number) => {
  const res = await axios.get(`${API_BASE}/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};