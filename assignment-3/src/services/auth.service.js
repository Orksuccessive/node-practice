const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

let users = [];
let nextUserId = 1;

async function createUser(email, password) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    email: user.email,
  };
}

async function validateUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  const passwordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordValid) {
    return null;
  }

  return {
    id: user._id,
    email: user.email,
  };
}

module.exports = {
  createUser,
  validateUser,
};