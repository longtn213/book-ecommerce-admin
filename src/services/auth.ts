import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:6868/api";

export const loginApi = async (username: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
  return res.data; // giả sử response có { token, user }
};

export const forgotPasswordApi = async (email: string) => axios.post(`${API_BASE}/auth/forgot-password`, { email });
export const resetPasswordApi = async (token: string, newPassword: string) => {
  return axios.post(`${API_BASE}/auth/reset-password`, {
    token,
    newPassword,
  });
};