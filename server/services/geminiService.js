const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Configure Gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

/**
 * Generates research ideas based on user data
 * @param {Object} user - The user data
 * @returns {Promise<string>} - Generated research ideas
 */
const generateResearchIdeas = async (user) => {
  const userProfile = `I am a researcher with the following profile:\n\n
  Bio: ${user.bio || "Not provided"}\n
  Department: ${user.department || "Not provided"}\n
  Position: ${user.position || "Not provided"}\n
  Interests: ${user.interests.length > 0 ? user.interests.join(", ") : "Not provided"}\n
  Disciplines: ${user.disciplines.length > 0 ? user.disciplines.join(", ") : "Not provided"}\n
  Research Areas: ${user.research_areas.length > 0 ? user.research_areas.join(", ") : "Not provided"}\n\n
  Based on this information, please provide 3-5 innovative and relevant research paper ideas that I could explore.`;

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: userProfile }],
      },
    ],
  });

  const result = await chatSession.sendMessage(userProfile);
  return result.response.text();
};

module.exports = { generateResearchIdeas };
