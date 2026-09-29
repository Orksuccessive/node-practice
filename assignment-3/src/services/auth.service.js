const bcrypt = require("bcryptjs");

let users = [];
let nextUserId = 1;

async function createUser(email, password) {
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: nextUserId++,
    email,
    password: hashedPassword,
  };

  users.push(user);

  return {
    id: user.id,
    email: user.email,
  };
}

async function validateUser(email, password) {
  const user = users.find((user) => user.email === email);

  if (!user) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}

module.exports = {
  createUser,
  validateUser,
};