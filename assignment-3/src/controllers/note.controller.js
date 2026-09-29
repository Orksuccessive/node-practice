const noteService = require("../services/note.service");
const path = require("path");
const fs = require("fs");

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

async function uploadAttachment(req, res) {
  const userId = req.user.userId;
  const noteId = Number(req.params.id);

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Image file is required",
      },
    });
  }

  const attachment = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
  };

  const note = noteService.addAttachment(
    userId,
    noteId,
    attachment
  );

  if (!note) {
    fs.unlink(req.file.path, () => {});

    return res.status(404).json({
      success: false,
      error: {
        message: "Note not found",
      },
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      message: "Attachment uploaded successfully",
      attachment: {
        filename: attachment.filename,
        originalName: attachment.originalName,
        mimeType: attachment.mimeType,
        size: attachment.size,
      },
    },
  });
}

async function getAttachment(req, res) {
  const userId = req.user.userId;
  const noteId = Number(req.params.id);

  const attachment = noteService.getAttachment(userId, noteId);

  if (!attachment) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Attachment not found",
      },
    });
  }

  if (!fs.existsSync(attachment.path)) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Attachment file does not exist",
      },
    });
  }

  res.setHeader("Content-Type", attachment.mimeType);

  const stream = fs.createReadStream(attachment.path);

  stream.on("error", () => {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: {
          message: "Failed to read attachment",
        },
      });
    }
  });

  stream.pipe(res);
}

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  uploadAttachment,
  getAttachment,
};