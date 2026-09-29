const express = require("express");

const noteController = require("../controllers/note.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", noteController.getNotes);

router.get("/:id", noteController.getNote);

router.post("/", noteController.createNote);

router.patch("/:id", noteController.updateNote);

router.delete("/:id", noteController.deleteNote);

module.exports = router;