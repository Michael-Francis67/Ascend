import api from "../api";

export const testimonialsAPI = {
  getAll: () => api.get("/testimonials"),

  getActive: () => api.get("/testimonials/active"),

  getById: (id: string) => api.get(`/testimonials/${id}`),

  create: (data: any) => api.post("/testimonials", data),

  update: (id: string, data: any) => api.put(`/testimonials/${id}`, data),

  delete: (id: string) => api.delete(`/testimonials/${id}`),

  toggleActive: (id: string) => api.patch(`/testimonials/${id}/toggle`),
};
