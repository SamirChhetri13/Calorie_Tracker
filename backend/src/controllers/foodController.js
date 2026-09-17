import FoodItem from "../models/FoodItem.js";
import AuditLog from "../models/AuditLog.js";

/**
 * @desc    Create a custom or global food item
 * @route   POST /api/v1/foods
 * @access  Private
 */
export const createFoodItem = async (req, res, next) => {
  try {
    const isVerified = req.user.role === "ADMIN" ? req.body.isVerified ?? true : false;

    const food = await FoodItem.create({
      ...req.body,
      isVerified,
      createdRole: req.user.role,
      createdBy: req.user._id,
    });

    await AuditLog.create({
      user: req.user._id,
      action: "FOOD_ITEM_CREATED",
      entity: "FoodItem",
      entityId: food._id.toString(),
      details: { name: food.name, calories: food.calories },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Food item created successfully!",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get food items with search, category filtering & pagination
 * @route   GET /api/v1/foods
 * @access  Private
 */
export const getFoodItems = async (req, res, next) => {
  try {
    const { q, category, verified, page = 1, limit = 20 } = req.query;

    const query = {};

    // Search query
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Verified filter
    if (verified === "true") {
      query.isVerified = true;
    }

    // Show verified global foods OR user's own created custom foods
    if (req.user.role !== "ADMIN") {
      query.$and = [
        { ...query },
        {
          $or: [
            { isVerified: true },
            { createdBy: req.user._id },
          ],
        },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const foods = await FoodItem.find(query)
      .sort({ isVerified: -1, name: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await FoodItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: foods.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: foods,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single food item details
 * @route   GET /api/v1/foods/:id
 * @access  Private
 */
export const getFoodItemById = async (req, res, next) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update food item
 * @route   PUT /api/v1/foods/:id
 * @access  Private (Owner or Admin)
 */
export const updateFoodItem = async (req, res, next) => {
  try {
    let food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // Check ownership or admin role
    if (food.createdBy?.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this food item",
      });
    }

    food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Food item updated successfully!",
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete food item
 * @route   DELETE /api/v1/foods/:id
 * @access  Private (Owner or Admin)
 */
export const deleteFoodItem = async (req, res, next) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    if (food.createdBy?.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this food item",
      });
    }

    await food.deleteOne();

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
