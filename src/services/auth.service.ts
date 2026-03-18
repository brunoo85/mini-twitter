import { api } from "../lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post<LoginResponse>("/auth/login", data),

  logout: () => api.post("/auth/logout"),
};
