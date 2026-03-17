// src/services/posts.service.ts
import { api } from "../lib/api";

export const postsService = {
  getAll: (params?: { search?: string; page?: number }) =>
    api.get("/posts", { params }),

  create: (data: FormData | object) => api.post("/posts", data),

  update: (id: string, data: object) => api.put(`/posts/${id}`, data),

  delete: (id: string) => api.delete(`/posts/${id}`),

  like: (id: string) => api.post(`/posts/${id}/like`),
};
