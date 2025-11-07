import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6868/api';
export const getPublishers = async (token: string) => {
  const res = await axios.get(`${API_BASE}/publishers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createPublisher = async (token: string, data: any) => {
  const res = await axios.post(`${API_BASE}/publishers`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const updatePublisher = async (token: string, data: any) => {
  const res = await axios.put(`${API_BASE}/publishers`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const deletePublisher = async (token: string, id: number) => {
  const res = await axios.delete(`${API_BASE}/publishers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
