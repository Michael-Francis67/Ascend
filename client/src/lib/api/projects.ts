import api from "../api";

export const projectsAPI = {
  getAll: () => api.get("/projects"),

  getById: (id: string) => api.get(`/projects/${id}`),

  create: (data: any) => api.post("/projects", data),

  update: (id: string, data: any) => api.put(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),

  toggleActive: (id: string) => api.patch(`/projects/${id}/toggle`),
};
