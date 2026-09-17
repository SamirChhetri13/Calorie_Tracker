import mongoose from "mongoose";

const healthProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
      min: 10,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    heightCm: {
      type: Number,
      required: true,
      min: 50,
      max: 250,
    },
    currentWeightKg: {
      type: Number,
      required: true,
      min: 20,
      max: 350,
    },
    goalWeightKg: {
      type: Number,
      required: true,
      min: 20,
      max: 350,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"],
      required: true,
      default: "sedentary",
    },
    primaryGoal: {
      type: String,
      enum: ["weight_loss", "maintenance", "weight_gain", "muscle_building"],
      required: true,
      default: "maintenance",
    },
    dietaryPreference: {
      type: String,
      enum: ["regular", "vegetarian", "vegan", "keto", "high_protein"],
      default: "regular",
    },
    bmr: {
      type: Number,
      default: 0,
    },
    tdee: {
      type: Number,
      default: 0,
    },
    targetCalories: {
      type: Number,
      default: 2000,
    },
    targetProteinG: {
      type: Number,
      default: 150,
    },
    targetCarbsG: {
      type: Number,
      default: 200,
    },
    targetFatG: {
      type: Number,
      default: 65,
    },
  },
  {
    timestamps: true,
  }
);

const HealthProfile = mongoose.model("HealthProfile", healthProfileSchema);
export default HealthProfile;
