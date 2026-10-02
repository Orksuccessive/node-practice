const express = require("express");

const requireAuth = require("../middleware/auth.middleware");
const postController = require("../controllers/post.controller");

const router = express.Router();

// Public endpoints
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);

// Authentication required for comments
router.post("/:id/comments", requireAuth, postController.addComment);

module.exports = router;