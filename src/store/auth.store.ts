import { create } from "zustand";
import { authService } from "../services/auth.service";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("token-user"),
  login: async (credentials: any) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem("token-user", data.token);
    set({ token: data.token });
  },
  logout: async () => {
    await authService.logout();
    localStorage.removeItem("token-user");
    set({ token: null });
  },
}));
