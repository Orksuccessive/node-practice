require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = 5000;

connectDB().then(() => {
app.listen(PORT, () => {
  console.log(`Notes API running on http://localhost:${PORT}`);
});
})
.catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });