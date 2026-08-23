import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  // baseURL: "http://187-127-135-158.traefik.me/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("customerAccessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;