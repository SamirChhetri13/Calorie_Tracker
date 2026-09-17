import React, { useState } from "react";
import Modal from "../common/Modal";
import { foodApi } from "../../api/foodApi";
import { Plus } from "lucide-react";

export default function CustomFoodModal({ isOpen, onClose, onFoodCreated }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Generic");
  const [category, setCategory] = useState("Other");
  const [servingSize, setServingSize] = useState(100);
  const [servingUnit, setServingUnit] = useState("g");
  const [calories, setCalories] = useState(150);
  const [protein, setProtein] = useState(10);
  const [carbs, setCarbs] = useState(20);
  const [fat, setFat] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await foodApi.createFood({
        name,
        brand,
        category,
        servingSize: parseFloat(servingSize),
        servingUnit,
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
      });
      if (data?.success) {
        onFoodCreated(data.data);
        onClose();
        setName("");
      }
    } catch (err) {
      console.error("Failed to create food item", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Custom Food Item">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-300 font-medium">Food Name *</label>
            <input
              type="text"
              placeholder="e.g. Protein Bar, Greek Salad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-300 font-medium">Brand Name</label>
            <input
              type="text"
              placeholder="Generic or Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-slate-300 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Grains">Grains</option>
              <option value="Proteins">Proteins</option>
              <option value="Dairy">Dairy</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks">Snacks</option>
              <option value="Prepared Meals">Prepared Meals</option>
              <option value="Supplements">Supplements</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-slate-300 font-medium">Serving Size</label>
            <input
              type="number"
              step="0.1"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-300 font-medium">Serving Unit</label>
            <input
              type="text"
              value={servingUnit}
              onChange={(e) => setServingUnit(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
          <div>
            <label className="text-orange-400 font-semibold">Calories (kcal)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-center font-bold text-slate-100"
            />
          </div>
          <div>
            <label className="text-blue-400 font-semibold">Protein (g)</label>
            <input
              type="number"
              step="0.1"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-center font-bold text-slate-100"
            />
          </div>
          <div>
            <label className="text-emerald-400 font-semibold">Carbs (g)</label>
            <input
              type="number"
              step="0.1"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-center font-bold text-slate-100"
            />
          </div>
          <div>
            <label className="text-amber-400 font-semibold">Fat (g)</label>
            <input
              type="number"
              step="0.1"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              required
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-center font-bold text-slate-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
        >
          <Plus className="w-4 h-4" /> Save Custom Food Item
        </button>
      </form>
    </Modal>
  );
}
