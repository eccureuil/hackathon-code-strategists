import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api"
});

// Intercepteur pour ajouter le token d'authentification
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== AUTHENTIFICATION ==========
export const authAPI = {
  login: (email, password) => API.post("/auth/login", { email, password }),
  register: (userData) => API.post("/auth/register", userData),
  getProfile: () => API.get("/auth/profile"),
};

// ========== MODULE BUS ==========
export const busAPI = {
  // Admin - Gestion des bus
  getAll: () => API.get("/bus"),
  getById: (id) => API.get(`/bus/${id}`),
  create: (data) => API.post("/bus", data),
  update: (id, data) => API.put(`/bus/${id}`, data),
  delete: (id) => API.delete(`/bus/${id}`),
  
  // Admin - Gestion des arrêts
  getAllStops: () => API.get("/bus/stops"),
  createStop: (stopName) => API.post("/bus/stops", { name: stopName }),
  deleteStop: (stopName) => API.delete(`/bus/stops/${stopName}`),
  
  // Admin - Utilitaires
  getAllLines: () => API.get("/bus/lines"),
  exportData: () => API.get("/bus/export"),
  importData: (data) => API.post("/bus/import", data),
  
  // Client - Recherche
  searchRoute: (params) => API.post("/bus/search", params),
  getLineDetails: (lineId) => API.get(`/bus/lines/${lineId}`),
};

export default API;