import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL ?? "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token-user");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem("token-user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);
