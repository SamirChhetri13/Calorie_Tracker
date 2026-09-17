import { z } from "zod";

export const foodItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brand: z.string().optional().default("Generic"),
  category: z.enum([
    "Fruits",
    "Vegetables",
    "Grains",
    "Proteins",
    "Dairy",
    "Beverages",
    "Snacks",
    "Prepared Meals",
    "Supplements",
    "Other",
  ]).optional().default("Other"),
  servingSize: z.number().min(0.1, "Serving size must be greater than 0"),
  servingUnit: z.string().min(1, "Serving unit is required").default("g"),
  calories: z.number().min(0, "Calories cannot be negative"),
  protein: z.number().min(0, "Protein cannot be negative"),
  carbs: z.number().min(0, "Carbs cannot be negative"),
  fat: z.number().min(0, "Fat cannot be negative"),
  fiber: z.number().min(0).optional().default(0),
  isVerified: z.boolean().optional().default(false),
  imageUrl: z.string().optional().default(""),
});
