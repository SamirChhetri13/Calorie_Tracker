import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";
import DailyMacroRing from "../components/logging/DailyMacroRing";
import ExerciseLogSection from "../components/logging/ExerciseLogSection";
import { recommendationApi } from "../api/recommendationApi";
import {
  Flame,
  Activity,
  Sparkles,
  Utensils,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { user, healthProfile } = useAuth();
  const { summary, refreshSummary, selectedDate } = useHealth();
  const [recommendationPreview, setRecommendationPreview] = useState(null);

  useEffect(() => {
    fetchRecommendation();
  }, [selectedDate]);

  const fetchRecommendation = async () => {
    try {
      const { data } = await recommendationApi.getRecommendations(selectedDate);
      if (data?.success) {
        setRecommendationPreview(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch recommendation preview", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white">Welcome back, {user?.name}!</h1>
            {user?.role === "ADMIN" && (
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ADMIN
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Goal: <strong className="text-emerald-400 capitalize">{healthProfile?.primaryGoal?.replace("_", " ")}</strong> • BMR: <strong className="text-slate-200">{healthProfile?.bmr} kcal</strong> • TDEE: <strong className="text-slate-200">{healthProfile?.tdee} kcal</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/logging"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Log Meal
          </Link>
          <Link
            to="/recommendations"
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" /> AI Recommendations
          </Link>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Macro Summary Ring */}
        <div className="lg:col-span-2 space-y-6">
          <DailyMacroRing summary={summary} />

          {/* Meals Quick Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <Utensils className="w-4 h-4 text-emerald-400" /> Today's Meal Summary
              </h3>
              <Link to="/logging" className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                View Detailed Log <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { name: "Breakfast", key: "breakfast" },
                { name: "Lunch", key: "lunch" },
                { name: "Dinner", key: "dinner" },
                { name: "Snack", key: "snack" },
              ].map((m) => {
                const mealData = summary?.mealsBreakdown?.[m.key] || { calories: 0, itemsCount: 0 };
                return (
                  <div key={m.key} className="glass-card p-3 rounded-xl border border-slate-800 space-y-1">
                    <p className="font-semibold text-slate-300">{m.name}</p>
                    <p className="text-lg font-bold text-white">{mealData.calories} <span className="text-[10px] text-slate-400 font-normal">kcal</span></p>
                    <p className="text-[10px] text-slate-400">{mealData.itemsCount} items logged</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Exercise & AI Recommendation Widget */}
        <div className="space-y-6">
          <ExerciseLogSection date={selectedDate} onUpdate={refreshSummary} />

          {/* AI Recommendation Mini Card */}
          {recommendationPreview && (
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-3 bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Menu Suggestion
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  {recommendationPreview.matchAccuracyPercentage}% Match
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Recommended Lunch: <strong className="text-white">{recommendationPreview.menu?.lunch?.title}</strong> ({recommendationPreview.menu?.lunch?.calories} kcal)
              </p>
              <Link
                to="/recommendations"
                className="block text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 py-2 rounded-xl transition-all"
              >
                View Full Daily AI Plan →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
