import axiosClient from "./axiosClient";

export const profileApi = {
  saveProfile: (data) => axiosClient.post("/profile", data),
  getProfile: () => axiosClient.get("/profile"),
};
