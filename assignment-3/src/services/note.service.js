let notes = [];
let nextId = 1;

function getAllNotes(userId, limit, offset) {
  const userNotes = notes.filter(
    (note) => note.userId === userId
  );

  return {
    notes: userNotes.slice(offset, offset + limit),
    total: userNotes.length,
  };
}

function getNoteById(userId, id) {
  return notes.find(
    (note) => note.id === id && note.userId === userId
  );
}

function createNote(userId, data) {
  const note = {
    id: nextId++,
    userId,
    title: data.title,
    content: data.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  notes.push(note);

  return note;
}

function updateNote(userId, id, data) {
  const note = getNoteById(userId, id);

  if (!note) {
    return null;
  }

  if (data.title !== undefined) {
    note.title = data.title;
  }

  if (data.content !== undefined) {
    note.content = data.content;
  }

  note.updatedAt = new Date().toISOString();

  return note;
}

function deleteNote(userId, id) {
  const index = notes.findIndex(
    (note) => note.id === id && note.userId === userId
  );

  if (index === -1) {
    return false;
  }

  notes.splice(index, 1);

  return true;
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

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  addAttachment,
  getAttachment,
};