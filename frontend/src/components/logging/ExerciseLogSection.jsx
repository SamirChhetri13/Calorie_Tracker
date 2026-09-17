import React, { useState, useEffect } from "react";
import { logApi } from "../../api/logApi";
import { Activity, Plus, Trash2, Flame } from "lucide-react";

export default function ExerciseLogSection({ date, onUpdate }) {
  const [exercises, setExercises] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [category, setCategory] = useState("Cardio");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState(250);

  useEffect(() => {
    fetchExercises();
  }, [date]);

  const fetchExercises = async () => {
    try {
      const { data } = await logApi.getExerciseLogs(date);
      if (data?.success) {
        setExercises(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch exercise logs", err);
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    try {
      await logApi.logExercise({
        date,
        exerciseName,
        category,
        durationMinutes: parseInt(durationMinutes, 10),
        caloriesBurned: parseInt(caloriesBurned, 10),
      });
      setExerciseName("");
      setShowAddForm(false);
      fetchExercises();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to log exercise", err);
    }
  };

  const handleDeleteExercise = async (id) => {
    try {
      await logApi.deleteExercise(id);
      fetchExercises();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to delete exercise", err);
    }
  };

  const totalBurned = exercises.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-400" /> Workout & Activity Log
        </h3>
        <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
          -{totalBurned} kcal Burned
        </span>
      </div>

      {exercises.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-1">No workout logged for this date.</p>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {exercises.map((ex) => (
            <div key={ex._id} className="glass-card p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-200">{ex.exerciseName}</p>
                <p className="text-[11px] text-slate-400">{ex.durationMinutes} min • {ex.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-orange-400 flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5" /> -{ex.caloriesBurned} kcal
                </span>
                <button onClick={() => handleDeleteExercise(ex._id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm ? (
        <form onSubmit={handleAddExercise} className="glass-card p-3 rounded-xl space-y-3 text-xs border border-slate-700">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Exercise name (e.g. Running, HIIT)"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              required
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 placeholder-slate-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100"
            >
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400">Duration (mins)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Est. Calories Burned</label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-100"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold py-1.5 rounded-lg">
              Save Exercise
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Log New Exercise
        </button>
      )}
    </div>
  );
}
