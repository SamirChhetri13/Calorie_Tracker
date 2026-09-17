import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../api/profileApi";
import { useAuth } from "../context/AuthContext";
import { HeartPulse, Flame, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  const { updateProfileState } = useAuth();
  const navigate = useNavigate();

  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("male");
  const [heightCm, setHeightCm] = useState(175);
  const [currentWeightKg, setCurrentWeightKg] = useState(75);
  const [goalWeightKg, setGoalWeightKg] = useState(70);
  const [activityLevel, setActivityLevel] = useState("moderately_active");
  const [primaryGoal, setPrimaryGoal] = useState("weight_loss");
  const [dietaryPreference, setDietaryPreference] = useState("regular");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await profileApi.saveProfile({
        age: parseInt(age, 10),
        gender,
        heightCm: parseFloat(heightCm),
        currentWeightKg: parseFloat(currentWeightKg),
        goalWeightKg: parseFloat(goalWeightKg),
        activityLevel,
        primaryGoal,
        dietaryPreference,
      });

      if (data?.success) {
        updateProfileState(data.data);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Failed to save health profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <Flame className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Biometric Setup</h1>
          <p className="text-xs text-slate-400">
            Powered by the Mifflin-St Jeor equation for scientific calorie & macro computation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Biological Gender</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    gender === "male"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    gender === "female"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* Height & Weights */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Goal (kg)</label>
              <input
                type="number"
                step="0.1"
                value={goalWeightKg}
                onChange={(e) => setGoalWeightKg(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none"
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="lightly_active">Lightly Active (1-3 days/week exercise)</option>
              <option value="moderately_active">Moderately Active (3-5 days/week workout)</option>
              <option value="very_active">Very Active (6-7 days intense sports/workout)</option>
              <option value="extra_active">Extra Active (Hard labor / athlete level training)</option>
            </select>
          </div>

          {/* Primary Health Goal */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Primary Nutrition Goal</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "weight_loss", title: "Weight Loss (-500 kcal Deficit)" },
                { id: "maintenance", title: "Maintain Weight (TDEE Balance)" },
                { id: "muscle_building", title: "Muscle Building (High Protein Surplus)" },
                { id: "weight_gain", title: "Weight Gain (+500 kcal Surplus)" },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setPrimaryGoal(g.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    primaryGoal === g.id
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {primaryGoal === g.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {g.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Dietary Preference</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none"
            >
              <option value="regular">Regular / Unrestricted</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto (High Fat Low Carb)</option>
              <option value="high_protein">High Protein Focus</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 text-sm"
          >
            {loading ? "Calculating Targets..." : "Calculate BMR & Complete Profile"}{" "}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
