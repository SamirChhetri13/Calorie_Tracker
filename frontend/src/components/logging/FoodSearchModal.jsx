import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { foodApi } from "../../api/foodApi";
import { Search, Plus, CheckCircle2, Flame } from "lucide-react";

export default function FoodSearchModal({ isOpen, onClose, mealType, onAddFoodItem }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen, query]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await foodApi.getFoods({ q: query, limit: 10 });
      setItems(data?.data || []);
    } catch (err) {
      console.error("Error fetching food items", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!selectedItem) return;

    const logItemPayload = {
      foodItem: selectedItem._id,
      name: selectedItem.name,
      servingSize: selectedItem.servingSize,
      servingUnit: selectedItem.servingUnit,
      quantity: parseFloat(quantity),
      calories: selectedItem.calories,
      protein: selectedItem.protein,
      carbs: selectedItem.carbs,
      fat: selectedItem.fat,
    };
    onAddFoodItem(logItemPayload);

    setSelectedItem(null);
    setQuantity(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Food to ${mealType.toUpperCase()}`}>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search chicken, oats, eggs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Results List */}
        <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <p className="text-center text-xs text-slate-400 py-4">Searching database...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-4">No matching food items found.</p>
          ) : (
            items.map((item) => {
              const isSelected = selectedItem?._id === item._id;

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-300"
                      : "bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-sm">
                      <span>{item.name}</span>
                      {item.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-slate-400">
                      Per {item.servingSize}{item.servingUnit} • P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> {item.calories} kcal
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quantity Selector & Confirm Action */}
        {selectedItem && (
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Serving Multiplier:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-emerald-400 focus:outline-none"
                />
                <span className="text-slate-400">servings</span>
              </div>
            </div>

            <button
              onClick={handleConfirmAdd}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Log to {mealType.toUpperCase()}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
