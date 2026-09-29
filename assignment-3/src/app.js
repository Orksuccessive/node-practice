const express = require("express");

const noteRoutes = require("./routes/note.routes");

const app = express();

app.use(express.json());

// Routes
app.use("/notes", noteRoutes);

// Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
    },
  });
});

module.exports = app;