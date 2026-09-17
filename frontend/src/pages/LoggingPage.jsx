import React, { useState, useEffect } from "react";
import { useHealth } from "../context/HealthContext";
import { logApi } from "../api/logApi";
import FoodSearchModal from "../components/logging/FoodSearchModal";
import { Utensils, Plus, Trash2, Flame, Sun, Sunset, Moon, Coffee } from "lucide-react";

export default function LoggingPage() {
  const { selectedDate, refreshSummary } = useHealth();
  const [mealLogs, setMealLogs] = useState([]);
  const [activeModalMeal, setActiveModalMeal] = useState(null);

  useEffect(() => {
    fetchMealLogs();
  }, [selectedDate]);

  const fetchMealLogs = async () => {
    try {
      const { data } = await logApi.getMealLogs(selectedDate);
      if (data?.success) {
        setMealLogs(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch meal logs", err);
    }
  };

  const handleAddFoodItem = async (logItem) => {
    try {
      await logApi.logMeal({
        date: selectedDate,
        mealType: activeModalMeal,
        items: [logItem],
      });
      fetchMealLogs();
      refreshSummary();
    } catch (err) {
      console.error("Failed to log meal item", err);
    }
  };

  const handleDeleteItem = async (logId, itemId) => {
    try {
      await logApi.deleteMealItem(logId, itemId);
      fetchMealLogs();
      refreshSummary();
    } catch (err) {
      console.error("Failed to delete log item", err);
    }
  };

  const meals = [
    { type: "breakfast", label: "Breakfast", icon: Sun, color: "text-amber-400" },
    { type: "lunch", label: "Lunch", icon: Utensils, color: "text-emerald-400" },
    { type: "dinner", label: "Dinner", icon: Sunset, color: "text-blue-400" },
    { type: "snack", label: "Snacks", icon: Coffee, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-400" /> Daily Food Journal
          </h1>
          <p className="text-xs text-slate-400">Log meals for <strong className="text-slate-200">{selectedDate}</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meals.map((meal) => {
          const Icon = meal.icon;
          const log = mealLogs.find((m) => m.mealType === meal.type);
          const items = log?.items || [];
          const totalCalories = log?.totalCalories || 0;

          return (
            <div key={meal.type} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
                    <Icon className={`w-5 h-5 ${meal.color}`} /> {meal.label}
                  </h3>
                  <span className="text-xs font-bold text-orange-400 flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5" /> {totalCalories} kcal
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-6 text-center">No food items logged for {meal.label}.</p>
                ) : (
                  <div className="divide-y divide-slate-800/60 pt-2 space-y-2">
                    {items.map((item) => (
                      <div key={item._id} className="pt-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-200">{item.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {item.quantity} × {item.servingSize}{item.servingUnit} • P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-300">{item.calories} kcal</span>
                          <button
                            onClick={() => handleDeleteItem(log._id, item._id)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveModalMeal(meal.type)}
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Food to {meal.label}
              </button>
            </div>
          );
        })}
      </div>

      {activeModalMeal && (
        <FoodSearchModal
          isOpen={!!activeModalMeal}
          onClose={() => setActiveModalMeal(null)}
          mealType={activeModalMeal}
          onAddFoodItem={handleAddFoodItem}
        />
      )}
    </div>
  );
}
