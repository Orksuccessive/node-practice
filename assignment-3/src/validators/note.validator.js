const { z } = require("zod");

const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),

  content: z
    .string()
    .min(1, "Content is required"),

    tags: z.array(z.string()).optional().default([]),
});

const updateNoteSchema = createNoteSchema.partial();

module.exports = {
  createNoteSchema,
  updateNoteSchema,
};