import mongoose from "mongoose";

const exerciseLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Cardio", "Strength", "Flexibility", "Sports", "Other"],
      default: "Cardio",
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    intensity: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate",
    },
    caloriesBurned: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

exerciseLogSchema.index({ user: 1, date: 1 });

const ExerciseLog = mongoose.model("ExerciseLog", exerciseLogSchema);
export default ExerciseLog;
