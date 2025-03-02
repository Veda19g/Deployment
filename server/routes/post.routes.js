const {createPost, getPosts, likePost, addComment, deletePost} = require('../controllers/post.controller');
const express = require("express");
const {authMiddleware} = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/get-posts", authMiddleware, getPosts);
router.put("/like/:id", authMiddleware, likePost);
router.post("/comment/:id", authMiddleware, addComment);
router.delete("/delete/:id", authMiddleware, deletePost);

module.exports = router;