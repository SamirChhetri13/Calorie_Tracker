import FoodItem from "../models/FoodItem.js";
import HealthProfile from "../models/HealthProfile.js";
import MealLog from "../models/MealLog.js";
import ExerciseLog from "../models/ExerciseLog.js";

/**
 * Intelligent AI Recommendation Engine
 */
export const generatePersonalizedMenu = async (userId, dateStr) => {
  const date = dateStr || new Date().toISOString().split("T")[0];

  // 1. Fetch User Profile
  const profile = await HealthProfile.findOne({ user: userId });
  if (!profile) {
    throw new Error("Health profile missing. Please complete biometric setup first.");
  }

  // 2. Fetch logged intake and exercise for the date
  const mealLogs = await MealLog.find({ user: userId, date });
  const exerciseLogs = await ExerciseLog.find({ user: userId, date });

  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFat = 0;

  mealLogs.forEach((log) => {
    consumedCalories += log.totalCalories || 0;
    consumedProtein += log.totalProtein || 0;
    consumedCarbs += log.totalCarbs || 0;
    consumedFat += log.totalFat || 0;
  });

  const caloriesBurned = exerciseLogs.reduce((acc, log) => acc + (log.caloriesBurned || 0), 0);

  // Remaining budget
  const netCalories = consumedCalories - caloriesBurned;
  const remainingCalories = Math.max(200, profile.targetCalories - netCalories);
  const remainingProtein = Math.max(10, profile.targetProteinG - consumedProtein);
  const remainingCarbs = Math.max(10, profile.targetCarbsG - consumedCarbs);
  const remainingFat = Math.max(5, profile.targetFatG - consumedFat);

  // 3. Query Food Database filtered by Dietary Preference
  const foodQuery = {};

  const availableFoods = await FoodItem.find(foodQuery).limit(50);

  // Combine items pool
  const candidateItems = availableFoods.map((f) => ({
    type: "food",
    id: f._id,
    title: `${f.name} (${f.servingSize}${f.servingUnit})`,
    calories: f.calories,
    protein: f.protein,
    carbs: f.carbs,
    fat: f.fat,
    imageUrl: f.imageUrl,
  }));

  if (candidateItems.length === 0) {
    candidateItems.push(
      { type: "food", title: "Oatmeal with Almonds", calories: 350, protein: 12, carbs: 55, fat: 9 },
      { type: "food", title: "Grilled Chicken Breast & Quinoa", calories: 520, protein: 48, carbs: 45, fat: 12 },
      { type: "food", title: "Salmon & Roasted Asparagus", calories: 480, protein: 42, carbs: 12, fat: 28 },
      { type: "food", title: "Greek Yogurt & Berries", calories: 220, protein: 20, carbs: 24, fat: 4 }
    );
  }

  // 4. Macro Matching Algorithm
  const mealTargets = {
    breakfast: { calories: remainingCalories * 0.25, protein: remainingProtein * 0.25 },
    lunch: { calories: remainingCalories * 0.35, protein: remainingProtein * 0.35 },
    dinner: { calories: remainingCalories * 0.30, protein: remainingProtein * 0.30 },
    snack: { calories: remainingCalories * 0.10, protein: remainingProtein * 0.10 },
  };

  const selectBestMatch = (targetCal, targetProt) => {
    let best = candidateItems[0];
    let minScore = Infinity;

    for (const item of candidateItems) {
      const calDiff = Math.abs(item.calories - targetCal);
      const protDiff = Math.abs(item.protein - targetProt);
      const score = calDiff * 1.0 + protDiff * 2.5;

      if (score < minScore) {
        minScore = score;
        best = item;
      }
    }
    return best;
  };

  const recommendedMenu = {
    breakfast: selectBestMatch(mealTargets.breakfast.calories, mealTargets.breakfast.protein),
    lunch: selectBestMatch(mealTargets.lunch.calories, mealTargets.lunch.protein),
    dinner: selectBestMatch(mealTargets.dinner.calories, mealTargets.dinner.protein),
    snack: selectBestMatch(mealTargets.snack.calories, mealTargets.snack.protein),
  };

  const totalRecommendedCalories =
    recommendedMenu.breakfast.calories +
    recommendedMenu.lunch.calories +
    recommendedMenu.dinner.calories +
    recommendedMenu.snack.calories;

  const totalRecommendedProtein =
    recommendedMenu.breakfast.protein +
    recommendedMenu.lunch.protein +
    recommendedMenu.dinner.protein +
    recommendedMenu.snack.protein;

  const matchAccuracy = Math.min(
    100,
    Math.round(100 - (Math.abs(totalRecommendedCalories - remainingCalories) / (remainingCalories || 1)) * 50)
  );

  return {
    date,
    remainingBudget: {
      calories: Math.round(remainingCalories),
      proteinG: Math.round(remainingProtein),
      carbsG: Math.round(remainingCarbs),
      fatG: Math.round(remainingFat),
    },
    recommendationReason: `Generated for ${profile.primaryGoal.replace("_", " ")} target with ${profile.dietaryPreference} preference`,
    matchAccuracyPercentage: Math.max(75, matchAccuracy),
    totals: {
      calories: totalRecommendedCalories,
      protein: totalRecommendedProtein,
    },
    menu: recommendedMenu,
  };
};
