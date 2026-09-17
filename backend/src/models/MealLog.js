import mongoose from "mongoose";

const logItemSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem",
  },
  name: {
    type: String,
    required: true,
  },
  servingSize: {
    type: Number,
    required: true,
  },
  servingUnit: {
    type: String,
    required: true,
    default: "g",
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
});

const mealLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    items: [logItemSchema],
    totalCalories: {
      type: Number,
      default: 0,
    },
    totalProtein: {
      type: Number,
      default: 0,
    },
    totalCarbs: {
      type: Number,
      default: 0,
    },
    totalFat: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

mealLogSchema.index({ user: 1, date: 1, mealType: 1 });

const MealLog = mongoose.model("MealLog", mealLogSchema);
export default MealLog;
