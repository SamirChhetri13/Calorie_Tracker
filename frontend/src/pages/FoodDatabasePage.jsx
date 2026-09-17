import React, { useState, useEffect } from "react";
import { foodApi } from "../api/foodApi";
import CustomFoodModal from "../components/food/CustomFoodModal";
import { BookOpen, Search, Plus, CheckCircle2, Flame, Filter } from "lucide-react";

export default function FoodDatabasePage() {
  const [foods, setFoods] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, [query, selectedCategory]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const { data } = await foodApi.getFoods({
        q: query,
        category: selectedCategory,
        limit: 30,
      });
      if (data?.success) {
        setFoods(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch foods", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "Fruits",
    "Vegetables",
    "Grains",
    "Proteins",
    "Dairy",
    "Beverages",
    "Snacks",
    "Prepared Meals",
    "Supplements",
    "Other",
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" /> Food & Nutrition Database
          </h1>
          <p className="text-xs text-slate-400">Search verified global ingredients or create custom food items</p>
        </div>
        <button
          onClick={() => setIsCustomModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add Custom Food
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search food by name or brand..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      {loading ? (
        <p className="text-center text-xs text-slate-400 py-12">Loading food items...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div key={food._id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-100 text-sm">{food.name}</h3>
                    {food.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-slate-400">{food.brand} • {food.category}</p>
                </div>
                <span className="text-xs font-extrabold text-orange-400 flex items-center gap-0.5 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                  <Flame className="w-3.5 h-3.5" /> {food.calories} kcal
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-center text-xs">
                <div className="bg-slate-900/60 p-1.5 rounded-lg">
                  <p className="text-[10px] text-slate-400">Serving</p>
                  <p className="font-semibold text-slate-200">{food.servingSize}{food.servingUnit}</p>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg">
                  <p className="text-[10px] text-blue-400">Protein</p>
                  <p className="font-semibold text-slate-200">{food.protein}g</p>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg">
                  <p className="text-[10px] text-emerald-400">Carbs</p>
                  <p className="font-semibold text-slate-200">{food.carbs}g</p>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg">
                  <p className="text-[10px] text-amber-400">Fat</p>
                  <p className="font-semibold text-slate-200">{food.fat}g</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CustomFoodModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onFoodCreated={fetchFoods}
      />
    </div>
  );
}
