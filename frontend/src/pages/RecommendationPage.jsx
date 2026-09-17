import React, { useState, useEffect } from "react";
import { recommendationApi } from "../api/recommendationApi";
import { useHealth } from "../context/HealthContext";
import { Sparkles, Flame, CheckCircle2, RefreshCw, Utensils } from "lucide-react";

export default function RecommendationPage() {
  const { selectedDate } = useHealth();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [selectedDate]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await recommendationApi.getRecommendations(selectedDate);
      if (data?.success) {
        setRecommendation(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-emerald-950/30 to-slate-900/90">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" /> AI Nutrition Recommendation Engine
          </h1>
          <p className="text-xs text-slate-400">
            Dynamically generates optimal daily meal suggestions matching your remaining macro budget.
          </p>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Regenerate Menu
        </button>
      </div>

      {loading ? (
        <p className="text-center text-xs text-slate-400 py-12">Running macro matching algorithm...</p>
      ) : recommendation ? (
        <div className="space-y-6">
          {/* Remaining Macro Budget Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm">Target Remaining Budget for {selectedDate}</h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                {recommendation.matchAccuracyPercentage}% Macro Match Accuracy
              </span>
            </div>
            <p className="text-xs text-slate-400">{recommendation.recommendationReason}</p>

            <div className="grid grid-cols-4 gap-3 text-center text-xs pt-2">
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[10px]">Calorie Budget</p>
                <p className="text-lg font-bold text-orange-400">{recommendation.remainingBudget?.calories} kcal</p>
              </div>
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[10px]">Protein Goal</p>
                <p className="text-lg font-bold text-blue-400">{recommendation.remainingBudget?.proteinG}g</p>
              </div>
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[10px]">Carbs Goal</p>
                <p className="text-lg font-bold text-emerald-400">{recommendation.remainingBudget?.carbsG}g</p>
              </div>
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[10px]">Fat Goal</p>
                <p className="text-lg font-bold text-amber-400">{recommendation.remainingBudget?.fatG}g</p>
              </div>
            </div>
          </div>

          {/* Recommended Daily Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { slot: "breakfast", label: "Recommended Breakfast" },
              { slot: "lunch", label: "Recommended Lunch" },
              { slot: "dinner", label: "Recommended Dinner" },
              { slot: "snack", label: "Recommended Snack" },
            ].map((m) => {
              const item = recommendation.menu?.[m.slot];
              if (!item) return null;

              return (
                <div key={m.slot} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{m.label}</span>
                      <span className="text-xs font-bold text-orange-400 flex items-center gap-0.5">
                        <Flame className="w-3.5 h-3.5" /> {item.calories} kcal
                      </span>
                    </div>

                    <div className="pt-3 space-y-1">
                      <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                        {item.title} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </h4>
                      <p className="text-xs text-slate-400">
                        P: <strong>{item.protein}g</strong> | C: <strong>{item.carbs}g</strong> | F: <strong>{item.fat}g</strong>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
