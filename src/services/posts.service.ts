import { api } from "../lib/api";

export const postsService = {
  getAll: (params?: { search?: string; page?: number }) =>
    api.get("/posts", { params }),

  create: (data: FormData | object) => api.post("/posts", data),

  update: (id: number, data: object) => api.put(`/posts/${id}`, data),

  delete: (id: number) => api.delete(`/posts/${id}`),

  like: (id: number) => api.post(`/posts/${id}/like`),
};
