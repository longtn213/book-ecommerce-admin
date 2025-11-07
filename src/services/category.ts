import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6868/api';
export const getCategories = async (token: string) => {
  const res = await axios.get(`${API_BASE}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createCategory = async (token: string, data: any) => {
  const res = await axios.post(`${API_BASE}/categories`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const updateCategory = async (token: string, data: any) => {
  const res = await axios.put(`${API_BASE}/categories`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const deleteCategory = async (token: string, id: number) => {
  const res = await axios.delete(`${API_BASE}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
