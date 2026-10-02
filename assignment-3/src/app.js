const express = require("express");

const noteRoutes = require("./routes/note.routes");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const multer = require("multer");


const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/posts", postRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
    },
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: {
          message: "File size must not exceed 2MB",
        },
      });
    }

    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }

  if (err.message === "Only JPG and PNG images are allowed") {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }

  // your existing error handling
  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || "Internal server error",
    },
  });
});

module.exports = app;