const jwt = require("jsonwebtoken");

const authService = require("../services/auth.service");
const { authSchema } = require("../validators/auth.validator");

const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

async function register(req, res) {
  const result = authSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        details: result.error.issues,
      },
    });
  }

  const { email, password } = result.data;

  const user = await authService.createUser(email, password);

  if (!user) {
    return res.status(409).json({
      success: false,
      error: {
        message: "User already exists",
      },
    });
  }

  res.status(201).json({
    success: true,
    data: user,
  });
}

async function login(req, res) {
  const result = authSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        details: result.error.issues,
      },
    });
  }

  const { email, password } = result.data;

  const user = await authService.validateUser(email, password);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Invalid email or password",
      },
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({
    success: true,
    data: {
      token,
    },
  });
}

module.exports = {
  register,
  login,
};