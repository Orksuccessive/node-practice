const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [1, "Content cannot be empty"],
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 10,
        message: "A note can have a maximum of 10 tags",
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook
noteSchema.pre("save", function () {
  if (this.title) {
    this.title = this.title.trim();
  }
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;