import axiosClient from "./axiosClient";

export const progressApi = {
  logProgress: (data) => axiosClient.post("/progress", data),
  getProgressHistory: (limit) => axiosClient.get("/progress", { params: { limit } }),
  deleteProgress: (id) => axiosClient.delete(`/progress/${id}`),
};
