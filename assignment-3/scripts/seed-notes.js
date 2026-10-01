require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Note = require("../src/models/note.model");

const MONGODB_URI = process.env.MONGODB_URI;

const TOTAL_NOTES = 10000;

async function seedNotes() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    const notes = [];

    // Use one fixed user ID for some notes and random users for others.
    const users = Array.from(
      { length: 20 },
      () => new mongoose.Types.ObjectId()
    );

    for (let i = 0; i < TOTAL_NOTES; i++) {
      const containsFoo = i % 10 === 0;

      const title = containsFoo
        ? `foo ${faker.lorem.words(3)}`
        : faker.lorem.sentence({ min: 3, max: 8 });

      notes.push({
        userId: faker.helpers.arrayElement(users),
        title,
        content: faker.lorem.paragraphs({ min: 1, max: 3 }),
        tags: faker.helpers.arrayElements(
          ["javascript", "node", "mongodb", "react", "backend", "api"],
          { min: 1, max: 3 }
        ),
        createdAt: faker.date.between({
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          to: new Date(),
        }),
        updatedAt: new Date(),
      });
    }

    await Note.insertMany(notes);

    console.log(`${TOTAL_NOTES} notes inserted successfully`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedNotes();