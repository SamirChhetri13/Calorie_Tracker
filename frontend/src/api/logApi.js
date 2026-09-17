import axiosClient from "./axiosClient";

export const logApi = {
  getSummary: (date) => axiosClient.get("/logs/summary", { params: { date } }),
  logMeal: (data) => axiosClient.post("/logs/meals", data),
  getMealLogs: (date) => axiosClient.get("/logs/meals", { params: { date } }),
  deleteMealItem: (logId, itemId) => axiosClient.delete(`/logs/meals/${logId}/items/${itemId}`),
  logExercise: (data) => axiosClient.post("/logs/exercise", data),
  getExerciseLogs: (date) => axiosClient.get("/logs/exercise", { params: { date } }),
  deleteExercise: (id) => axiosClient.delete(`/logs/exercise/${id}`),
};
