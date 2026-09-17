import { generatePersonalizedMenu } from "../services/recommendationEngine.js";

/**
 * @desc    Get AI-driven personalized meal recommendations for current remaining macro budget
 * @route   GET /api/v1/recommendations
 * @access  Private
 */
export const getDailyRecommendations = async (req, res, next) => {
  try {
    const { date } = req.query;
    const recommendation = await generatePersonalizedMenu(req.user._id, date);

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    next(error);
  }
};
