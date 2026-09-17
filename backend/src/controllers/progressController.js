import ProgressLog from "../models/ProgressLog.js";
import HealthProfile from "../models/HealthProfile.js";
import AuditLog from "../models/AuditLog.js";

/**
 * @desc    Log weight and body metrics progress
 * @route   POST /api/v1/progress
 * @access  Private
 */
export const logProgress = async (req, res, next) => {
  try {
    const { date, weightKg, bodyFatPercentage, chestCm, waistCm, hipCm, notes, photoUrl } = req.body;
    const userId = req.user._id;

    const progress = await ProgressLog.findOneAndUpdate(
      { user: userId, date },
      {
        weightKg,
        bodyFatPercentage,
        chestCm,
        waistCm,
        hipCm,
        notes,
        photoUrl,
      },
      { new: true, upsert: true }
    );

    // Update currentWeight in HealthProfile dynamically if today's weight is logged!
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      const profile = await HealthProfile.findOne({ user: userId });
      if (profile) {
        profile.currentWeightKg = weightKg;
        await profile.save();
      }
    }

    await AuditLog.create({
      user: userId,
      action: "PROGRESS_LOGGED",
      entity: "ProgressLog",
      entityId: progress._id.toString(),
      details: { weightKg, date },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Progress logged successfully!",
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get progress history
 * @route   GET /api/v1/progress?limit=30
 * @access  Private
 */
export const getProgressHistory = async (req, res, next) => {
  try {
    const { limit = 30 } = req.query;

    const history = await ProgressLog.find({ user: req.user._id })
      .sort({ date: 1 })
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete progress log
 * @route   DELETE /api/v1/progress/:id
 * @access  Private
 */
export const deleteProgressLog = async (req, res, next) => {
  try {
    const log = await ProgressLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Progress log not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Progress log deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
