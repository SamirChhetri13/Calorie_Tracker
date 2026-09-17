import axiosClient from "./axiosClient";

export const reportApi = {
  getCalorieTrends: (days) => axiosClient.get("/analytics/calorie-trends", { params: { days } }),
  getMacroDistribution: (days) => axiosClient.get("/analytics/macro-distribution", { params: { days } }),
  getWeightTrends: () => axiosClient.get("/analytics/weight-trends"),
};
