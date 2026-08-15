import api from "../api";

export const teamAPI = {
  getAll: () => api.get("/team"),

  getById: (id: string) => api.get(`/team/${id}`),

  create: (data: any) => api.post("/team", data),

  update: (id: string, data: any) => api.put(`/team/${id}`, data),

  delete: (id: string) => api.delete(`/team/${id}`),

  toggleActive: (id: string) => api.patch(`/team/${id}/toggle`),

  reorder: (ids: string[]) => api.post("/team/reorder", { ids }),
};
