import axiosClient from "./axiosClient";

export const foodApi = {
  getFoods: (params) => axiosClient.get("/foods", { params }),
  getFoodById: (id) => axiosClient.get(`/foods/${id}`),
  createFood: (data) => axiosClient.post("/foods", data),
  updateFood: (id, data) => axiosClient.put(`/foods/${id}`, data),
  deleteFood: (id) => axiosClient.delete(`/foods/${id}`),
};
