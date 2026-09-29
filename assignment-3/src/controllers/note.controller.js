const noteService = require("../services/note.service");

const {
  createNoteSchema,
  updateNoteSchema,
} = require("../validators/note.validator");

function getNotes(req, res) {
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;

  if (limit < 1 || offset < 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid pagination parameters",
      },
    });
  }

  const userId = req.user.userId;

  const result = noteService.getAllNotes(
    userId,
    limit,
    offset
  );

  res.json({
    success: true,
    data: result.notes,
    pagination: {
      limit,
      offset,
      total: result.total,
    },
  });
}

function getNote(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid note ID",
      },
    });
  }

  const note = noteService.getNoteById(
    req.user.userId,
    id
  );

  if (!note) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Note not found",
      },
    });
  }

  res.json({
    success: true,
    data: note,
  });
}

function createNote(req, res) {
  const result = createNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        details: result.error.issues,
      },
    });
  }

  const note = noteService.createNote(
    req.user.userId,
    result.data
  );

  res.status(201).json({
    success: true,
    data: note,
  });
}

function updateNote(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid note ID",
      },
    });
  }

  const result = updateNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        details: result.error.issues,
      },
    });
  }

  const note = noteService.updateNote(
    req.user.userId,
    id,
    result.data
  );

  if (!note) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Note not found",
      },
    });
  }

  res.json({
    success: true,
    data: note,
  });
}

function deleteNote(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid note ID",
      },
    });
  }

  const deleted = noteService.deleteNote(
    req.user.userId,
    id
  );

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Note not found",
      },
    });
  }

  res.status(204).send();
}

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};