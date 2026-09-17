import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";
import User from "../models/User.js";
import HealthProfile from "../models/HealthProfile.js";
import FoodItem from "../models/FoodItem.js";
import MealLog from "../models/MealLog.js";
import ExerciseLog from "../models/ExerciseLog.js";
import ProgressLog from "../models/ProgressLog.js";

const initialFoods = [
  { name: "Oatmeal (Rolled Oats)", brand: "Quaker", category: "Grains", servingSize: 100, servingUnit: "g", calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, isVerified: true },
  { name: "Chicken Breast (Raw)", brand: "Generic", category: "Proteins", servingSize: 100, servingUnit: "g", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, isVerified: true },
  { name: "Salmon Fillet (Raw)", brand: "Ocean Catch", category: "Proteins", servingSize: 100, servingUnit: "g", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, isVerified: true },
  { name: "Greek Yogurt (Non-Fat)", brand: "Chobani", category: "Dairy", servingSize: 170, servingUnit: "g", calories: 100, protein: 18, carbs: 6, fat: 0.7, fiber: 0, isVerified: true },
  { name: "Brown Rice (Cooked)", brand: "Uncle Ben's", category: "Grains", servingSize: 100, servingUnit: "g", calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, fiber: 1.8, isVerified: true },
  { name: "Avocado", brand: "Generic", category: "Fruits", servingSize: 150, servingUnit: "g", calories: 240, protein: 3, carbs: 12, fat: 22, fiber: 10, isVerified: true },
  { name: "Banana", brand: "Generic", category: "Fruits", servingSize: 118, servingUnit: "g", calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, isVerified: true },
  { name: "Eggs (Large)", brand: "Farm Fresh", category: "Proteins", servingSize: 50, servingUnit: "g", calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, isVerified: true },
  { name: "Almonds (Raw)", brand: "Blue Diamond", category: "Snacks", servingSize: 28, servingUnit: "g", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, isVerified: true },
  { name: "Spinach (Fresh)", brand: "Organic Fresh", category: "Vegetables", servingSize: 100, servingUnit: "g", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, isVerified: true },
  { name: "Broccoli (Steam Cooked)", brand: "Generic", category: "Vegetables", servingSize: 100, servingUnit: "g", calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3, isVerified: true },
  { name: "Whey Protein Isolate", brand: "Optimum Nutrition", category: "Supplements", servingSize: 30, servingUnit: "g", calories: 120, protein: 24, carbs: 1, fat: 1, fiber: 0, isVerified: true },
  { name: "Whole Milk", brand: "Organic Valley", category: "Dairy", servingSize: 240, servingUnit: "ml", calories: 149, protein: 7.7, carbs: 11.7, fat: 8, fiber: 0, isVerified: true },
  { name: "Sweet Potato (Baked)", brand: "Generic", category: "Vegetables", servingSize: 100, servingUnit: "g", calories: 90, protein: 2, carbs: 20.7, fat: 0.1, fiber: 3.3, isVerified: true },
  { name: "Peanut Butter (Smooth)", brand: "Jif", category: "Snacks", servingSize: 32, servingUnit: "g", calories: 190, protein: 7, carbs: 7, fat: 16, fiber: 2, isVerified: true },
];

export const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("[Seed Script] Connected to MongoDB");

    // Clean existing dummy records
    await Promise.all([
      User.deleteMany({}),
      HealthProfile.deleteMany({}),
      FoodItem.deleteMany({}),
      MealLog.deleteMany({}),
      ExerciseLog.deleteMany({}),
      ProgressLog.deleteMany({}),
    ]);
    console.log("[Seed Script] Cleared existing dummy user data and logs");

    // Create System Admin Account for governance
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);

    const admin = await User.create({
      name: "System Admin",
      email: "admin@nutripulse.io",
      password: adminPassword,
      role: "ADMIN",
    });

    // Populate Verified Global Food Database
    const createdFoods = await FoodItem.insertMany(
      initialFoods.map((f) => ({ ...f, createdBy: admin._id }))
    );
    console.log(`[Seed Script] Seeded ${createdFoods.length} verified baseline global food items`);

    console.log("-------------------------------------------------------");
    console.log("DATABASE SEEDING COMPLETE!");
    console.log("All dummy users and sample meal/exercise logs removed.");
    console.log("System Admin Account: admin@nutripulse.io / admin123");
    console.log("-------------------------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("[Seed Script Error]", error);
    process.exit(1);
  }
};

// Auto run if invoked directly
if (process.argv[2] === "--run") {
  seedDatabase();
}
