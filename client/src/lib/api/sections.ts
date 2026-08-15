import api from "../api";

export const sectionsAPI = {
  getAll: () => api.get("/sections"),

  getById: (id: string) => api.get(`/sections/${id}`),

  getByKey: (key: string) => api.get(`/sections/key/${key}`),

  create: (data: any) => api.post("/sections", data),

  update: (id: string, data: any) => api.put(`/sections/${id}`, data),

  delete: (id: string) => api.delete(`/sections/${id}`),

  toggleActive: (id: string) => api.patch(`/sections/${id}/toggle`),

  reorder: (ids: string[]) => api.post("/sections/reorder", { ids }),

  updateImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/sections/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateGallery: (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return api.post(`/sections/${id}/gallery`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
