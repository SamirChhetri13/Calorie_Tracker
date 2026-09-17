import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      default: "Generic",
      trim: true,
    },
    category: {
      type: String,
      enum: ["Fruits", "Vegetables", "Grains", "Proteins", "Dairy", "Beverages", "Snacks", "Prepared Meals", "Supplements", "Other"],
      default: "Other",
    },
    servingSize: {
      type: Number,
      required: true,
      default: 100,
    },
    servingUnit: {
      type: String,
      required: true,
      default: "g",
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
    },
    carbs: {
      type: Number,
      required: true,
      min: 0,
    },
    fat: {
      type: Number,
      required: true,
      min: 0,
    },
    fiber: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdRole: {
      type: String,
      enum: ["USER", "NUTRITIONIST", "ADMIN"],
      default: "USER",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

foodItemSchema.index({ name: "text", brand: "text" });

const FoodItem = mongoose.model("FoodItem", foodItemSchema);
export default FoodItem;
