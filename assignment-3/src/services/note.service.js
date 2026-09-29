let notes = [];
let nextId = 1;

// Get all notes with pagination
function getAllNotes(limit, offset) {
  return {
    notes: notes.slice(offset, offset + limit),
    total: notes.length,
  };
}

// Get note by ID
function getNoteById(id) {
  return notes.find((note) => note.id === id);
}

// Create note
function createNote(data) {
  const note = {
    id: nextId++,
    title: data.title,
    content: data.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  notes.push(note);

  return note;
}

// Update note
function updateNote(id, data) {
  const note = getNoteById(id);

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

// Delete note
function deleteNote(id) {
  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return false;
  }

  notes.splice(index, 1);

  return true;
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};