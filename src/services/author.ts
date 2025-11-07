import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:6868/api';


export const getAuthors = async (token: string) =>
  axios.get(`${API_BASE}/authors`, { headers: { Authorization: `Bearer ${token}` } });

export const createAuthor = async (token: string, data: any) =>
  axios.post(`${API_BASE}/authors`, data, { headers: { Authorization: `Bearer ${token}` } });

export const updateAuthor = async (token: string, data: any) =>
  axios.put(`${API_BASE}/authors`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteAuthor = async (token: string, id: number) =>
  axios.delete(`${API_BASE}/authors/${id}`, { headers: { Authorization: `Bearer ${token}` } });
