/**
 * Mifflin-St Jeor BMR & TDEE Macro Calculation Engine
 */

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

/**
 * Calculates BMR using Mifflin-St Jeor equation
 * Male: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
 * Female: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
 */
export const calculateBMR = ({ weightKg, heightCm, age, gender }) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? Math.round(base + 5) : Math.round(base - 161);
};

/**
 * Calculates TDEE (Total Daily Energy Expenditure)
 */
export const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

/**
 * Computes calorie and macronutrient targets based on primary goal
 */
export const calculateNutritionalTargets = ({ tdee, primaryGoal, weightKg }) => {
  let targetCalories = tdee;

  // Calorie adjustments based on goal
  switch (primaryGoal) {
    case "weight_loss":
      targetCalories = Math.max(1200, tdee - 500); // 500 kcal deficit
      break;
    case "weight_gain":
      targetCalories = tdee + 500; // 500 kcal surplus
      break;
    case "muscle_building":
      targetCalories = tdee + 350; // Lean surplus
      break;
    case "maintenance":
    default:
      targetCalories = tdee;
      break;
  }

  let proteinRatio = 0.30;
  let carbRatio = 0.40;
  let fatRatio = 0.30;

  if (primaryGoal === "muscle_building" || primaryGoal === "weight_loss") {
    proteinRatio = 0.35;
    carbRatio = 0.40;
    fatRatio = 0.25;
  } else if (primaryGoal === "weight_gain") {
    proteinRatio = 0.25;
    carbRatio = 0.50;
    fatRatio = 0.25;
  }

  // 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal
  const targetProteinG = Math.round((targetCalories * proteinRatio) / 4);
  const targetCarbsG = Math.round((targetCalories * carbRatio) / 4);
  const targetFatG = Math.round((targetCalories * fatRatio) / 9);

  return {
    targetCalories: Math.round(targetCalories),
    targetProteinG,
    targetCarbsG,
    targetFatG,
  };
};

/**
 * Master calculation runner for Health Profile
 */
export const computeFullBiometrics = (profileData) => {
  const { currentWeightKg, heightCm, age, gender, activityLevel, primaryGoal } = profileData;

  const bmr = calculateBMR({ weightKg: currentWeightKg, heightCm, age, gender });
  const tdee = calculateTDEE(bmr, activityLevel);
  const targets = calculateNutritionalTargets({ tdee, primaryGoal, weightKg: currentWeightKg });

  return {
    bmr,
    tdee,
    ...targets,
  };
};
