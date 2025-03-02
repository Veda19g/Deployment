const express = require("express");
const { generateResearchIdeasController } = require("../controllers/researchController");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/generate-ideas",authMiddleware,generateResearchIdeasController);

module.exports = router;
