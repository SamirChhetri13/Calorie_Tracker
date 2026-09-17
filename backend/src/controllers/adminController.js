import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import FoodItem from "../models/FoodItem.js";
import MealLog from "../models/MealLog.js";

/**
 * @desc    Get system users list
 * @route   GET /api/v1/admin/users
 * @access  Private (ADMIN)
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/v1/admin/users/:id/role
 * @access  Private (ADMIN)
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["USER", "NUTRITIONIST", "ADMIN"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await AuditLog.create({
      user: req.user._id,
      action: "ROLE_UPDATED",
      entity: "User",
      entityId: user._id.toString(),
      details: { newRole: role, targetEmail: user.email },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully!`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get audit logs
 * @route   GET /api/v1/admin/audit-logs
 * @access  Private (ADMIN)
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get global system metrics
 * @route   GET /api/v1/admin/metrics
 * @access  Private (ADMIN)
 */
export const getSystemMetrics = async (req, res, next) => {
  try {
    const [totalUsers, totalFoods, totalMealLogs] = await Promise.all([
      User.countDocuments(),
      FoodItem.countDocuments(),
      MealLog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalFoods,
        totalMealLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};
