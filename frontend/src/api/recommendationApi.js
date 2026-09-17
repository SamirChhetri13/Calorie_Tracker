import axiosClient from "./axiosClient";

export const recommendationApi = {
  getRecommendations: (date) => axiosClient.get("/recommendations", { params: { date } }),
};
