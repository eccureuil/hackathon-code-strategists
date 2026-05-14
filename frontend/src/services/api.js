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
  login: (email, password) => API.post("/users/login", { email, password }),
  register: (userData) => API.post("/users/register", userData),
  getProfile: () => API.get("/users/profile"),
};

// ========== GESTION DES ARRÊTS ==========
export const stopsAPI = {
  getAll: () => API.get("/bus/stops"),
  getById: (id) => API.get(`/bus/stops/${id}`),
  create: (data) => API.post("/bus/stops", data),
  update: (id, data) => API.put(`/bus/stops/${id}`, data),
  delete: (id) => API.delete(`/bus/stops/${id}`),
};

// ========== GESTION DES LIGNES DE BUS ==========
export const busAPI = {
  // Admin - Gestion des lignes
  getAll: () => API.get("/bus"),
  getById: (id) => API.get(`/bus/${id}`),
  create: (data) => API.post("/bus", data),
  update: (id, data) => API.put(`/bus/${id}`, data),
  delete: (id) => API.delete(`/bus/${id}`),
  
  // Client - Recherche
  getAllLines: () => API.get("/bus/lines"),
  searchRoute: (params) => API.post("/bus/search", params),
  searchLine: (query) => API.get(`/bus/lines/search?q=${query}`),
  getDetails: (id) => API.get(`/bus/lines/${id}/details`),
  
  // Admin - Import/Export
  exportData: () => API.get("/bus/export"),
  importData: (data) => API.post("/bus/import", data),
};

export default API;