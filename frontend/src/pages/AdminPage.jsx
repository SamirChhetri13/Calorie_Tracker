import React, { useState, useEffect } from "react";
import { adminApi } from "../api/adminApi";
import { ShieldCheck, Users, BookOpen, Utensils, Activity, FileText } from "lucide-react";

export default function AdminPage() {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // users | audit
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, uRes, aRes] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getUsers(),
        adminApi.getAuditLogs(30),
      ]);

      if (mRes.data?.success) setMetrics(mRes.data.data);
      if (uRes.data?.success) setUsers(uRes.data.data);
      if (aRes.data?.success) setAuditLogs(aRes.data.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      fetchAdminData();
    } catch (err) {
      console.error("Failed to update user role", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" /> Admin Command Center
          </h1>
          <p className="text-xs text-slate-400">System user governance, audit log monitoring, and global metrics</p>
        </div>
      </div>

      {/* Global System Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Users</p>
              <p className="text-xl font-extrabold text-white">{metrics.totalUsers}</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Global Foods</p>
              <p className="text-xl font-extrabold text-white">{metrics.totalFoods}</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Saved Recipes</p>
              <p className="text-xl font-extrabold text-white">{metrics.totalRecipes}</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Logged Meals</p>
              <p className="text-xl font-extrabold text-white">{metrics.totalMealLogs}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold max-w-md">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeTab === "users" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeTab === "audit" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Health Audit Logs ({auditLogs.length})
        </button>
      </div>

      {activeTab === "users" ? (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">System Registered Users</h3>
          <div className="divide-y divide-slate-800">
            {users.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-200">{u.name}</p>
                  <p className="text-[10px] text-slate-400">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="NUTRITIONIST">NUTRITIONIST</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> System Audit Logs
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log._id} className="glass-card p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-400">{log.action}</span>
                  <p className="text-[10px] text-slate-400">Entity: {log.entity} • User: {log.user?.email || "System"}</p>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
