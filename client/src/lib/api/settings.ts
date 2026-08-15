import api from "../api";

export const settingsAPI = {
  getAll: () => api.get("/settings"),

  getGroup: (group: string) => api.get(`/settings/group/${group}`),

  getByKey: (key: string) => api.get(`/settings/${key}`),

  set: (key: string, value: any, type?: string) =>
    api.post("/settings", { key, value, type }),

  update: (key: string, value: any) => api.put(`/settings/${key}`, { value }),

  delete: (key: string) => api.delete(`/settings/${key}`),
};
