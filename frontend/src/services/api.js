import axios from "axios";

export const API_BASE = "http://localhost:5050";

const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
