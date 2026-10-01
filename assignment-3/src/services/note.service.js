let notes = [];
let nextId = 1;

const Note = require("../models/note.model");


async function getAllNotes(userId, limit = 10, offset = 0) {
  return Note.find({ userId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
}

async function getNoteById(userId, id) {
  return Note.findOne({
    _id: id,
    userId,
  });
}

async function createNote(userId, data) {
  return Note.create({
    userId,
    title: data.title,
    content: data.content,
    tags: data.tags || [],
  });
}

async function updateNote(userId, id, data) {
  return Note.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}

async function deleteNote(userId, id) {
  return Note.findOneAndDelete({
    _id: id,
    userId,
  });
}

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
              _id: "$userId",
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