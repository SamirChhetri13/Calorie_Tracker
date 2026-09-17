import { z } from "zod";

export const profileSchema = z.object({
  age: z.number().min(10, "Age must be at least 10").max(120, "Invalid age"),
  gender: z.enum(["male", "female"]),
  heightCm: z.number().min(50, "Height must be at least 50 cm").max(250, "Height cannot exceed 250 cm"),
  currentWeightKg: z.number().min(20, "Weight must be at least 20 kg").max(350, "Weight cannot exceed 350 kg"),
  goalWeightKg: z.number().min(20, "Goal weight must be at least 20 kg").max(350, "Goal weight cannot exceed 350 kg"),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ]),
  primaryGoal: z.enum([
    "weight_loss",
    "maintenance",
    "weight_gain",
    "muscle_building",
  ]),
  dietaryPreference: z.enum([
    "regular",
    "vegetarian",
    "vegan",
    "keto",
    "high_protein",
  ]).optional().default("regular"),
});
