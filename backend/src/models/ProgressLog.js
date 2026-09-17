import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema(
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
    weightKg: {
      type: Number,
      required: true,
    },
    bodyFatPercentage: {
      type: Number,
      min: 2,
      max: 60,
    },
    chestCm: {
      type: Number,
    },
    waistCm: {
      type: Number,
    },
    hipCm: {
      type: Number,
    },
    notes: {
      type: String,
      default: "",
    },
    photoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

progressLogSchema.index({ user: 1, date: 1 }, { unique: true });

const ProgressLog = mongoose.model("ProgressLog", progressLogSchema);
export default ProgressLog;
