import axiosClient from "./axiosClient";

export const adminApi = {
  getUsers: () => axiosClient.get("/admin/users"),
  updateUserRole: (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role }),
  getAuditLogs: (limit) => axiosClient.get("/admin/audit-logs", { params: { limit } }),
  getMetrics: () => axiosClient.get("/admin/metrics"),
};
