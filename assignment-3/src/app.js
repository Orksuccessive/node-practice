const express = require("express");

const noteRoutes = require("./routes/note.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
    },
  });
});

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