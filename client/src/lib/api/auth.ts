import api from "../api";

export const authAPI = {
  requestOtp: (email: string) => api.post("/auth/request-otp", { email }),

  verifyOtp: (email: string, otp: string) =>
    api.post("/auth/verify-otp", { email, otp }),

  logout: () => api.post("/auth/logout"),

  getMe: () => api.get("/auth/me"),

  refresh: () => api.post("/auth/refresh"),
};
