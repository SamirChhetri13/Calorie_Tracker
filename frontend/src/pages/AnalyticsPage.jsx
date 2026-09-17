import React, { useState, useEffect } from "react";
import { reportApi } from "../api/reportApi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { PieChart, TrendingUp, Flame, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const [calorieTrends, setCalorieTrends] = useState([]);
  const [macroDistribution, setMacroDistribution] = useState([]);
  const [weightTrends, setWeightTrends] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [calRes, macroRes, weightRes] = await Promise.all([
        reportApi.getCalorieTrends(days),
        reportApi.getMacroDistribution(days),
        reportApi.getWeightTrends(),
      ]);

      if (calRes.data?.success) setCalorieTrends(calRes.data.data);
      if (macroRes.data?.success) setMacroDistribution(macroRes.data.data);
      if (weightRes.data?.success) setWeightTrends(weightRes.data.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <PieChart className="w-6 h-6 text-emerald-400" /> Analytical Dashboards & Reports
          </h1>
          <p className="text-xs text-slate-400">Interactive charts visualizing intake trends, macronutrient ratios, and weight progress</p>
        </div>

        {/* Days Filter */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                days === d ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-xs text-slate-400 py-12">Loading visual charts...</p>
      ) : (
        <div className="space-y-6">
          {/* Calorie Intake vs Target Bar Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Daily Calorie Intake vs Target ({days} Days)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                  />
                  <Legend />
                  <Bar dataKey="consumed" name="Consumed Calories (kcal)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Calorie Goal Target" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Macro Distribution Pie Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-400" /> Macronutrient Caloric Breakdown
              </h3>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={macroDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="calories"
                      nameKey="name"
                    >
                      {macroDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                    />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weight Trends Line Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Body Weight Progression (kg)
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="weight" name="Actual Weight (kg)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="targetWeight" name="Goal Target (kg)" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
