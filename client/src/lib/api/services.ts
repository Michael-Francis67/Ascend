import api from "../api";

export const servicesAPI = {
  getAll: () => api.get("/services"),

  getById: (id: string) => api.get(`/services/${id}`),

  create: (data: any) => api.post("/services", data),

  update: (id: string, data: any) => api.put(`/services/${id}`, data),

  delete: (id: string) => api.delete(`/services/${id}`),

  toggleActive: (id: string) => api.patch(`/services/${id}/toggle`),

  reorder: (ids: string[]) => api.post("/services/reorder", { ids }),
};
