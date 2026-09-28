const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} - ${responseTime}ms`
    );
  });

  next();
});

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests, please try again later.",
  },
});

app.use(limiter);

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "REST API is working",
  });
});

// Test error route
app.get("/error", (req, res, next) => {
  next(new AppError("Something went wrong", 400));
});

// Central error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});