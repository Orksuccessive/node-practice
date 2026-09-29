const fs = require("fs");
const path = require("path");

const directory = process.argv[2];

if (!directory) {
  console.error("Usage: node file-counter.js <directory>");
  process.exit(1);
}

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content.split("\n").length;
  } catch (error) {
    console.error(`Cannot read ${filePath}: ${error.message}`);
    return null;
  }
}

function scanDirectory(dir) {
  let entries;

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    console.error(`Cannot access ${dir}: ${error.message}`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") || entry.name.endsWith(".ts"))
    ) {
      const lines = countLines(fullPath);

      if (lines !== null) {
        console.log(`${fullPath} - ${lines} lines`);
      }
    }
  }
}

scanDirectory(path.resolve(directory));