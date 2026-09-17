import MealLog from "../models/MealLog.js";
import ExerciseLog from "../models/ExerciseLog.js";
import HealthProfile from "../models/HealthProfile.js";
import AuditLog from "../models/AuditLog.js";

/**
 * @desc    Log or add items to a meal (breakfast, lunch, dinner, snack)
 * @route   POST /api/v1/logs/meals
 * @access  Private
 */
export const logMeal = async (req, res, next) => {
  try {
    const { date, mealType, items } = req.body;
    const userId = req.user._id;

    let mealLog = await MealLog.findOne({ user: userId, date, mealType });

    // Calculate aggregated item totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const formattedItems = items.map((item) => {
      totalCalories += item.calories * item.quantity;
      totalProtein += item.protein * item.quantity;
      totalCarbs += item.carbs * item.quantity;
      totalFat += item.fat * item.quantity;

      return {
        ...item,
        calories: Math.round(item.calories * item.quantity),
        protein: Math.round(item.protein * item.quantity * 10) / 10,
        carbs: Math.round(item.carbs * item.quantity * 10) / 10,
        fat: Math.round(item.fat * item.quantity * 10) / 10,
      };
    });

    if (mealLog) {
      mealLog.items.push(...formattedItems);
      mealLog.totalCalories += Math.round(totalCalories);
      mealLog.totalProtein += Math.round(totalProtein * 10) / 10;
      mealLog.totalCarbs += Math.round(totalCarbs * 10) / 10;
      mealLog.totalFat += Math.round(totalFat * 10) / 10;
      await mealLog.save();
    } else {
      mealLog = await MealLog.create({
        user: userId,
        date,
        mealType,
        items: formattedItems,
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein * 10) / 10,
        totalCarbs: Math.round(totalCarbs * 10) / 10,
        totalFat: Math.round(totalFat * 10) / 10,
      });
    }

    res.status(200).json({
      success: true,
      message: `${mealType.toUpperCase()} logged successfully!`,
      data: mealLog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all meal logs for a specific date
 * @route   GET /api/v1/logs/meals?date=YYYY-MM-DD
 * @access  Private
 */
export const getMealLogsByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split("T")[0];

    const mealLogs = await MealLog.find({ user: req.user._id, date: targetDate });

    res.status(200).json({
      success: true,
      date: targetDate,
      data: mealLogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete item from meal log
 * @route   DELETE /api/v1/logs/meals/:logId/items/:itemId
 * @access  Private
 */
export const deleteMealLogItem = async (req, res, next) => {
  try {
    const { logId, itemId } = req.params;

    const mealLog = await MealLog.findOne({ _id: logId, user: req.user._id });
    if (!mealLog) {
      return res.status(404).json({
        success: false,
        message: "Meal log not found",
      });
    }

    mealLog.items = mealLog.items.filter((item) => item._id.toString() !== itemId);

    mealLog.totalCalories = mealLog.items.reduce((acc, i) => acc + i.calories, 0);
    mealLog.totalProtein = mealLog.items.reduce((acc, i) => acc + i.protein, 0);
    mealLog.totalCarbs = mealLog.items.reduce((acc, i) => acc + i.carbs, 0);
    mealLog.totalFat = mealLog.items.reduce((acc, i) => acc + i.fat, 0);

    await mealLog.save();

    res.status(200).json({
      success: true,
      message: "Item removed from meal log",
      data: mealLog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log exercise session
 * @route   POST /api/v1/logs/exercise
 * @access  Private
 */
export const logExercise = async (req, res, next) => {
  try {
    const { date, exerciseName, category, durationMinutes, intensity, caloriesBurned } = req.body;

    const exerciseLog = await ExerciseLog.create({
      user: req.user._id,
      date,
      exerciseName,
      category,
      durationMinutes,
      intensity,
      caloriesBurned,
    });

    res.status(201).json({
      success: true,
      message: "Exercise logged successfully!",
      data: exerciseLog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get exercise logs for date
 * @route   GET /api/v1/logs/exercise?date=YYYY-MM-DD
 * @access  Private
 */
export const getExerciseLogs = async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const exerciseLogs = await ExerciseLog.find({ user: req.user._id, date });

    res.status(200).json({
      success: true,
      data: exerciseLogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete exercise log
 * @route   DELETE /api/v1/logs/exercise/:id
 * @access  Private
 */
export const deleteExerciseLog = async (req, res, next) => {
  try {
    const exercise = await ExerciseLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise log not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exercise log deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complete daily summary (Target vs Consumed vs Exercise Net Calories)
 * @route   GET /api/v1/logs/summary?date=YYYY-MM-DD
 * @access  Private
 */
export const getDailySummary = async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const userId = req.user._id;

    const profile = await HealthProfile.findOne({ user: userId });
    const targetCalories = profile ? profile.targetCalories : 2000;
    const targetProteinG = profile ? profile.targetProteinG : 150;
    const targetCarbsG = profile ? profile.targetCarbsG : 200;
    const targetFatG = profile ? profile.targetFatG : 65;

    const mealLogs = await MealLog.find({ user: userId, date });

    let consumedCalories = 0;
    let consumedProtein = 0;
    let consumedCarbs = 0;
    let consumedFat = 0;

    const mealsBreakdown = {
      breakfast: { calories: 0, itemsCount: 0 },
      lunch: { calories: 0, itemsCount: 0 },
      dinner: { calories: 0, itemsCount: 0 },
      snack: { calories: 0, itemsCount: 0 },
    };

    mealLogs.forEach((log) => {
      consumedCalories += log.totalCalories || 0;
      consumedProtein += log.totalProtein || 0;
      consumedCarbs += log.totalCarbs || 0;
      consumedFat += log.totalFat || 0;

      if (mealsBreakdown[log.mealType]) {
        mealsBreakdown[log.mealType].calories += log.totalCalories || 0;
        mealsBreakdown[log.mealType].itemsCount += log.items.length || 0;
      }
    });

    const exerciseLogs = await ExerciseLog.find({ user: userId, date });
    const caloriesBurned = exerciseLogs.reduce((acc, item) => acc + (item.caloriesBurned || 0), 0);

    const netCalories = consumedCalories - caloriesBurned;
    const remainingCalories = targetCalories - netCalories;

    res.status(200).json({
      success: true,
      date,
      summary: {
        targetCalories,
        consumedCalories: Math.round(consumedCalories),
        caloriesBurned: Math.round(caloriesBurned),
        netCalories: Math.round(netCalories),
        remainingCalories: Math.round(remainingCalories),
        macros: {
          protein: { consumed: Math.round(consumedProtein), target: targetProteinG },
          carbs: { consumed: Math.round(consumedCarbs), target: targetCarbsG },
          fat: { consumed: Math.round(consumedFat), target: targetFatG },
        },
        mealsBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
