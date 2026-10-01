const express = require("express");
const upload = require("../middleware/upload.middleware");

const noteController = require("../controllers/note.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", noteController.getNotes);

router.get("/stats", noteController.getNoteStats);

router.get("/:id", noteController.getNote);

router.post("/", noteController.createNote);

router.patch("/:id", noteController.updateNote);

router.delete("/:id", noteController.deleteNote);

router.post(
  "/:id/attachment",
  upload.single("image"),
  noteController.uploadAttachment
);

router.get(
  "/:id/attachment",
  noteController.getAttachment
);

module.exports = router;