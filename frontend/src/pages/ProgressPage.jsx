import React, { useState, useEffect } from "react";
import { progressApi } from "../api/progressApi";
import { useAuth } from "../context/AuthContext";
import { TrendingUp, Scale, Plus, Calendar, Trash2 } from "lucide-react";

export default function ProgressPage() {
  const { healthProfile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weightKg, setWeightKg] = useState(healthProfile?.currentWeightKg || 75);
  const [bodyFatPercentage, setBodyFatPercentage] = useState(20);
  const [waistCm, setWaistCm] = useState(85);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await progressApi.getProgressHistory(30);
      if (data?.success) {
        setHistory(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch progress history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await progressApi.logProgress({
        date,
        weightKg: parseFloat(weightKg),
        bodyFatPercentage: parseFloat(bodyFatPercentage),
        waistCm: parseFloat(waistCm),
      });
      fetchHistory();
    } catch (err) {
      console.error("Failed to log progress", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await progressApi.deleteProgress(id);
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete progress", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" /> Body Metrics & Weight Progress
          </h1>
          <p className="text-xs text-slate-400">Track weight trends vs goal target of {healthProfile?.goalWeightKg} kg</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weight Log Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" /> Log Weight Entry
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold text-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">Body Fat % (Optional)</label>
              <input
                type="number"
                step="0.1"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">Waist Measurement (cm)</label>
              <input
                type="number"
                step="0.1"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20 mt-2"
            >
              <Plus className="w-4 h-4" /> Save Weight Record
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Recent Progress History</h3>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">No progress records logged yet.</p>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {history.map((log) => (
                <div key={log._id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{log.weightKg} kg</p>
                      <p className="text-[10px] text-slate-400">{log.date} • Goal: {healthProfile?.goalWeightKg} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {log.bodyFatPercentage && (
                      <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                        {log.bodyFatPercentage}% Body Fat
                      </span>
                    )}
                    <button onClick={() => handleDelete(log._id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
