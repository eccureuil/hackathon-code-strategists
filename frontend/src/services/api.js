import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
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

// Intercepteur pour les erreurs
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.config?.url, error.message);
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
  getAll: () => API.get("/bus/"),
  getById: (id) => API.get(`/bus/${id}`),
  create: (data) => API.post("/bus/", data),
  update: (id, data) => API.put(`/bus/${id}`, data),
  delete: (id) => API.delete(`/bus/${id}`),
};

// ========== GESTION DES LIGNES DE BUS ==========
export const busAPI = {
  getAll: () => API.get("/bus"),
  getById: (id) => API.get(`/bus/${id}`),
  create: (data) => API.post("/bus", data),
  update: (id, data) => API.put(`/bus/${id}`, data),
  delete: (id) => API.delete(`/bus/${id}`),
  getAllLines: () => API.get("/bus/lines"),
  searchRoute: (params) => API.post("/bus/search", params),
  searchLine: (query) => API.get(`/bus/lines/search?q=${query}`),
};

export default API;