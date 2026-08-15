import api from "../api";

export const uploadAPI = {
  uploadSingle: (file: File, alt?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (alt) formData.append("alt", alt);
    return api.post("/upload/single", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadMultiple: (files: File[], alt?: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (alt) formData.append("alt", alt);
    return api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (publicId: string) => api.delete(`/upload/${publicId}`),

  getAll: () => api.get("/upload"),

  getOptimized: (
    url: string,
    width?: number,
    height?: number,
    quality?: number,
  ) =>
    api.get("/upload/optimize", {
      params: { url: encodeURIComponent(url), width, height, quality },
    }),
};
