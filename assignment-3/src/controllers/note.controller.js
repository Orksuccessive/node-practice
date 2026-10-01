const noteService = require("../services/note.service");
const path = require("path");
const fs = require("fs");

const {
  createNoteSchema,
  updateNoteSchema,
} = require("../validators/note.validator");

const getNotes = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const notes = await noteService.getAllNotes(
      req.user.userId,
      { limit, offset }
    );

    res.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

const getNote = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(
      req.user.userId,
      req.params.id
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    console.log("AUTH USER:", req.user);

    const note = await noteService.createNote(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(
      req.user.userId,
      req.params.id,
      req.body
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await noteService.deleteNote(
      req.user.userId,
      req.params.id
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

async function getNoteStats(req, res) {
  try {
    const stats = await noteService.getNoteStats();

    res.status(200).json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error("Get note stats error:", error);

    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch note statistics",
      },
    });
  }
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
  getNoteStats,
};