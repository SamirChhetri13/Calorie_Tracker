import React from "react";
import { Flame, Activity } from "lucide-react";

export default function DailyMacroRing({ summary }) {
  if (!summary) return null;

  const { targetCalories, netCalories, consumedCalories, caloriesBurned, remainingCalories, macros } = summary;

  const calPercentage = Math.min(100, Math.round((netCalories / (targetCalories || 2000)) * 100));
  const proteinPercentage = Math.min(100, Math.round((macros.protein.consumed / (macros.protein.target || 150)) * 100));
  const carbsPercentage = Math.min(100, Math.round((macros.carbs.consumed / (macros.carbs.target || 200)) * 100));
  const fatPercentage = Math.min(100, Math.round((macros.fat.consumed / (macros.fat.target || 65)) * 100));

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" /> Daily Calorie Budget
          </h2>
          <p className="text-xs text-slate-400">Net Calories = Consumed - Exercise Burned</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {remainingCalories >= 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal over`}
          </span>
        </div>
      </div>

      {/* Main Net Calorie Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline text-sm">
          <div className="space-x-3">
            <span className="text-2xl font-extrabold text-white">{netCalories}</span>
            <span className="text-xs text-slate-400">/ {targetCalories} kcal Target</span>
          </div>
          <span className="font-semibold text-xs text-slate-300">{calPercentage}%</span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              calPercentage > 100
                ? "bg-gradient-to-r from-red-500 to-orange-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-400"
            }`}
            style={{ width: `${Math.min(100, calPercentage)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 pt-1">
          <span>Intake: {consumedCalories} kcal</span>
          <span className="flex items-center gap-1 text-orange-400">
            <Activity className="w-3 h-3" /> Burned: {caloriesBurned} kcal
          </span>
        </div>
      </div>

      {/* Macronutrient Cards */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        {/* Protein */}
        <div className="glass-card p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-blue-400">Protein</span>
            <span className="text-slate-400 text-[11px]">{proteinPercentage}%</span>
          </div>
          <p className="text-base font-bold text-slate-100">
            {macros.protein.consumed}g <span className="text-xs text-slate-400 font-normal">/ {macros.protein.target}g</span>
          </p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${proteinPercentage}%` }} />
          </div>
        </div>

        {/* Carbs */}
        <div className="glass-card p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-emerald-400">Carbs</span>
            <span className="text-slate-400 text-[11px]">{carbsPercentage}%</span>
          </div>
          <p className="text-base font-bold text-slate-100">
            {macros.carbs.consumed}g <span className="text-xs text-slate-400 font-normal">/ {macros.carbs.target}g</span>
          </p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${carbsPercentage}%` }} />
          </div>
        </div>

        {/* Fat */}
        <div className="glass-card p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-amber-400">Fat</span>
            <span className="text-slate-400 text-[11px]">{fatPercentage}%</span>
          </div>
          <p className="text-base font-bold text-slate-100">
            {macros.fat.consumed}g <span className="text-xs text-slate-400 font-normal">/ {macros.fat.target}g</span>
          </p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${fatPercentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
