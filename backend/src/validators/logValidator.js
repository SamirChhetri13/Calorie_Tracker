import { z } from "zod";

export const mealLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  items: z.array(
    z.object({
      foodItem: z.string().optional(),
      name: z.string().min(1, "Name is required"),
      servingSize: z.number().min(0.1),
      servingUnit: z.string().min(1),
      quantity: z.number().min(0.1, "Quantity must be greater than 0"),
      calories: z.number().min(0),
      protein: z.number().min(0),
      carbs: z.number().min(0),
      fat: z.number().min(0),
    })
  ).min(1, "Must log at least one item"),
});

export const exerciseLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  exerciseName: z.string().min(2, "Exercise name is required"),
  category: z.enum(["Cardio", "Strength", "Flexibility", "Sports", "Other"]).optional().default("Cardio"),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
  intensity: z.enum(["low", "moderate", "high"]).optional().default("moderate"),
  caloriesBurned: z.number().min(0, "Calories burned cannot be negative"),
});
