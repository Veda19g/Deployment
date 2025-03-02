const User = require("../models/User.Model");
const { generateResearchIdeas } = require("../services/geminiService");
const { formatSuccessResponse, formatErrorResponse } = require("../utils/responseFormatter");

/**
 * Controller to handle research idea generation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateResearchIdeasController = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user data from MongoDB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(formatErrorResponse("User not found"));
    }

    // Generate research ideas
    const ideas = await generateResearchIdeas(user);

    res.json(formatSuccessResponse({ ideas }));
  } catch (error) {
    console.error("Error generating ideas:", error);
    res.status(500).json(formatErrorResponse("Internal server error"));
  }
};

module.exports = { generateResearchIdeasController };
