import HealthProfile from "../models/HealthProfile.js";
import AuditLog from "../models/AuditLog.js";
import { computeFullBiometrics } from "../utils/mifflinStJeor.js";

/**
 * @desc    Create or update current user's biometric health profile
 * @route   POST /api/v1/profile
 * @access  Private
 */
export const createOrUpdateProfile = async (req, res, next) => {
  try {
    const {
      age,
      gender,
      heightCm,
      currentWeightKg,
      goalWeightKg,
      activityLevel,
      primaryGoal,
      dietaryPreference,
    } = req.body;

    const computedMetrics = computeFullBiometrics({
      age,
      gender,
      heightCm,
      currentWeightKg,
      goalWeightKg,
      activityLevel,
      primaryGoal,
    });

    let profile = await HealthProfile.findOne({ user: req.user._id });

    const profilePayload = {
      user: req.user._id,
      age,
      gender,
      heightCm,
      currentWeightKg,
      goalWeightKg,
      activityLevel,
      primaryGoal,
      dietaryPreference: dietaryPreference || "regular",
      ...computedMetrics,
    };

    if (profile) {
      profile = await HealthProfile.findOneAndUpdate(
        { user: req.user._id },
        profilePayload,
        { new: true, runValidators: true }
      );
    } else {
      profile = await HealthProfile.create(profilePayload);
    }

    // Log Audit event
    await AuditLog.create({
      user: req.user._id,
      action: "PROFILE_UPDATED",
      entity: "HealthProfile",
      entityId: profile._id.toString(),
      details: {
        bmr: profile.bmr,
        tdee: profile.tdee,
        targetCalories: profile.targetCalories,
        primaryGoal: profile.primaryGoal,
      },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Health profile saved and targets recalculated successfully!",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's biometric health profile
 * @route   GET /api/v1/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(444).json({
        success: false,
        message: "Health profile not found. Please complete onboarding.",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
