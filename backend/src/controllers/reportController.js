import MealLog from "../models/MealLog.js";
import ExerciseLog from "../models/ExerciseLog.js";
import ProgressLog from "../models/ProgressLog.js";
import HealthProfile from "../models/HealthProfile.js";

/**
 * Helper to get date array for past N days
 */
const getLastNDaysDates = (n = 7) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

/**
 * @desc    Get Calorie & Net Intake Trends formatted for Recharts
 * @route   GET /api/v1/analytics/calorie-trends?days=7
 * @access  Private
 */
export const getCalorieTrends = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days || "7", 10);
    const dates = getLastNDaysDates(days);
    const userId = req.user._id;

    const profile = await HealthProfile.findOne({ user: userId });
    const targetCalories = profile ? profile.targetCalories : 2000;

    const mealLogs = await MealLog.find({ user: userId, date: { $in: dates } });
    const exerciseLogs = await ExerciseLog.find({ user: userId, date: { $in: dates } });

    const trends = dates.map((d) => {
      const dayMeals = mealLogs.filter((m) => m.date === d);
      const dayExercises = exerciseLogs.filter((e) => e.date === d);

      const consumed = dayMeals.reduce((acc, m) => acc + (m.totalCalories || 0), 0);
      const burned = dayExercises.reduce((acc, e) => acc + (e.caloriesBurned || 0), 0);
      const net = consumed - burned;

      return {
        date: d,
        displayDate: d.slice(5), // MM-DD
        consumed: Math.round(consumed),
        burned: Math.round(burned),
        net: Math.round(net),
        target: targetCalories,
      };
    });

    res.status(200).json({
      success: true,
      days,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Macronutrient Distribution breakdown over time for Pie/Donut Recharts
 * @route   GET /api/v1/analytics/macro-distribution?days=7
 * @access  Private
 */
export const getMacroDistribution = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days || "7", 10);
    const dates = getLastNDaysDates(days);
    const userId = req.user._id;

    const profile = await HealthProfile.findOne({ user: userId });

    const mealLogs = await MealLog.find({ user: userId, date: { $in: dates } });

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    mealLogs.forEach((log) => {
      totalProtein += log.totalProtein || 0;
      totalCarbs += log.totalCarbs || 0;
      totalFat += log.totalFat || 0;
    });

    const proteinCalories = totalProtein * 4;
    const carbCalories = totalCarbs * 4;
    const fatCalories = totalFat * 9;
    const totalMacroCalories = proteinCalories + carbCalories + fatCalories || 1;

    const distribution = [
      {
        name: "Protein",
        grams: Math.round(totalProtein),
        calories: Math.round(proteinCalories),
        percentage: Math.round((proteinCalories / totalMacroCalories) * 100),
        targetGrams: (profile?.targetProteinG || 150) * days,
        color: "#3b82f6", // Blue
      },
      {
        name: "Carbohydrates",
        grams: Math.round(totalCarbs),
        calories: Math.round(carbCalories),
        percentage: Math.round((carbCalories / totalMacroCalories) * 100),
        targetGrams: (profile?.targetCarbsG || 200) * days,
        color: "#10b981", // Emerald
      },
      {
        name: "Fats",
        grams: Math.round(totalFat),
        calories: Math.round(fatCalories),
        percentage: Math.round((fatCalories / totalMacroCalories) * 100),
        targetGrams: (profile?.targetFatG || 65) * days,
        color: "#f59e0b", // Amber
      },
    ];

    res.status(200).json({
      success: true,
      days,
      data: distribution,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Weight progress trend over time vs goal weight for Line Recharts
 * @route   GET /api/v1/analytics/weight-trends
 * @access  Private
 */
export const getWeightTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await HealthProfile.findOne({ user: userId });
    const goalWeight = profile ? profile.goalWeightKg : 70;

    const progressLogs = await ProgressLog.find({ user: userId }).sort({ date: 1 }).limit(60);

    const trends = progressLogs.map((log) => ({
      date: log.date,
      weight: log.weightKg,
      bodyFat: log.bodyFatPercentage || null,
      targetWeight: goalWeight,
    }));

    res.status(200).json({
      success: true,
      goalWeight,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};
