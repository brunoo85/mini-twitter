import { create } from "zustand";
import { authService } from "../services/auth.service";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("accessToken"),
  login: async (credentials: any) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem("accessToken", data.token);
    set({ token: data.token });
  },
  logout: async () => {
    await authService.logout();
    localStorage.removeItem("accessToken");
    set({ token: null });
  },
}));
