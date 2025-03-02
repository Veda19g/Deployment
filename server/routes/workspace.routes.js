const { createWorkspace, getWorkspaceById, addMemberToWorkspace, createDocumentinWorkspace, getAllWorkspaces } = require("../controllers/workspace.controller");
const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/create", authMiddleware, createWorkspace);
router.post("/add-member", authMiddleware, addMemberToWorkspace);
router.post("/create-document", authMiddleware, createDocumentinWorkspace);
router.get("/get-workspaces/all", authMiddleware, getAllWorkspaces); // Move this above
router.get("/get-workspace/:workspaceId", authMiddleware, getWorkspaceById);

module.exports = router;
