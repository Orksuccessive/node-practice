require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = 5000;

connectDB().then(() => {
app.listen(PORT, () => {
  console.log(`Notes API running on http://localhost:${PORT}`);
});
});