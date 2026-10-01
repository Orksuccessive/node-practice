import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Auth and Notes API", () => {
  test("Register → login → create note → read note", async () => {
    const email = `user-${Date.now()}@example.com`;
    const password = "password123";

    // 1. Register
    const registerResponse = await request(app)
      .post("/auth/register")
      .send({
        email,
        password,
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);

    // 2. Login
    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email,
        password,
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data.token).toBeDefined();

    const token = loginResponse.body.data.token;

    // 3. Create note
    const createResponse = await request(app)
      .post("/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Note",
        content: "This note was created by an authenticated user.",
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.title).toBe("Test Note");

    const noteId = createResponse.body.data.id;

    // 4. Read note
    const getResponse = await request(app)
      .get(`/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.success).toBe(true);
    expect(getResponse.body.data.id).toBe(noteId);
    expect(getResponse.body.data.title).toBe("Test Note");
  });

  test("Reject requests without a valid token", async () => {
    const response = await request(app)
      .get("/notes");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("Reject requests with an invalid token", async () => {
    const response = await request(app)
      .get("/notes")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("Reject another user from accessing someone else's note", async () => {
    const timestamp = Date.now();

    const user1 = {
      email: `user1-${timestamp}@example.com`,
      password: "password123",
    };

    const user2 = {
      email: `user2-${timestamp}@example.com`,
      password: "password123",
    };

    // Register user 1
    await request(app)
      .post("/auth/register")
      .send(user1)
      .expect(201);

    // Register user 2
    await request(app)
      .post("/auth/register")
      .send(user2)
      .expect(201);

    // Login user 1
    const loginUser1 = await request(app)
      .post("/auth/login")
      .send(user1)
      .expect(200);

    const tokenUser1 = loginUser1.body.data.token;

    // Login user 2
    const loginUser2 = await request(app)
      .post("/auth/login")
      .send(user2)
      .expect(200);

    const tokenUser2 = loginUser2.body.data.token;

    // User 1 creates a note
    const createResponse = await request(app)
      .post("/notes")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        title: "Private Note",
        content: "Only user 1 should access this.",
      })
      .expect(201);

    const noteId = createResponse.body.data.id;

    // User 2 tries to read user 1's note
    const response = await request(app)
      .get(`/notes/${noteId}`)
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});