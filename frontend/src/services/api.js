import axios from "axios";

export const API_BASE = "http://localhost:5050";

const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => API.post("/users/login", { email, password }),
  register: (userData) => API.post("/users/register", userData),
  getProfile: () => API.get("/users/profile"),
};

export const stopsAPI = {
  getAll: () => API.get("/stops"),
  getById: (id) => API.get(`/stops/${id}`),
  create: (data) => API.post("/stops", data),
  update: (id, data) => API.put(`/stops/${id}`, data),
  delete: (id) => API.delete(`/stops/${id}`),
};

export const busAPI = {
  getAll: () => API.get("/buses"),
  getById: (id) => API.get(`/buses/${id}`),
  create: (data) => API.post("/buses", data),
  update: (id, data) => API.put(`/buses/${id}`, data),
  delete: (id) => API.delete(`/buses/${id}`),
  getAllLines: () => API.get("/buses/lines"),
  searchRoute: (params) => API.post("/buses/search", params),
  searchLine: (query) => API.get(`/buses/lines/search?q=${query}`),
  getDetails: (id) => API.get(`/buses/lines/${id}/details`),
  exportData: () => API.get("/buses/export"),
  importData: (data) => API.post("/buses/import", data),
};

export default API;
