let notes = [];
let nextId = 1;
const mongoose = require("mongoose");
const Note = require("../models/note.model");


const getAllNotes = async (userId, { limit = 10, offset = 0 }) => {
  return Note.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
};

const getNoteById = async (userId, noteId) => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return null;
  }

  return Note.findOne({
    _id: noteId,
    owner: userId,
  });
};

const createNote = async (userId, data) => {
  return Note.create({
    ...data,
    owner: userId,
  });
};

const updateNote = async (userId, noteId, data) => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return null;
  }

  return Note.findOneAndUpdate(
    {
      _id: noteId,
      owner: userId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteNote = async (userId, noteId) => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return null;
  }

  return Note.findOneAndDelete({
    _id: noteId,
    owner: userId,
  });
};

 function addAttachment(userId, id, attachment) {
  const note = notes.find(
    (note) => note.id === id && note.userId === userId
  );

  if (!note) {
    return null;
  }

  note.attachment = attachment;

  return note;
}

function getAttachment(userId, id) {
  const note = notes.find(
    (note) => note.id === id && note.userId === userId
  );

  if (!note || !note.attachment) {
    return null;
  }

  return note.attachment;
}

async function getNoteStats() {
  return Note.aggregate([
    {
      $facet: {
        notesPerUser: [
          {
            $group: {
              _id: "$owner",
              totalNotes: { $sum: 1 },
            },
          },
          {
            $sort: {
              totalNotes: -1,
            },
          },
        ],

        topTags: [
          {
            $unwind: "$tags",
          },
          {
            $group: {
              _id: "$tags",
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
          {
            $limit: 10,
          },
        ],

        notesPerDay: [
          {
            $match: {
              createdAt: {
                $gte: new Date(
                  Date.now() - 7 * 24 * 60 * 60 * 1000
                ),
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                },
              },
              totalNotes: { $sum: 1 },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ],
      },
    },
  ]);
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  addAttachment,
  getAttachment,
  getNoteStats,
};