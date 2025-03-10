import orchestrator from "tests/orchestrator.js";
import migrator from "../../../../../models/migrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await migrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://0.0.0.0:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "igorguariroba",
          email: "igorguariroba@gmail.com",
          password: "123456",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "igorguariroba",
        email: "igorguariroba@gmail.com",
        password: "123456",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("with duplicated 'email'", async () => {
      const response = await fetch("http://0.0.0.0:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicated",
          email: "duplicated@gmail.com",
          password: "123456",
        }),
      });

      expect(response.status).toBe(201);

      const response2 = await fetch("http://0.0.0.0:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicated2",
          email: "Duplicated@gmail.com",
          password: "123456",
        }),
      });

      expect(response2.status).toBe(400);
      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email já está sendo utilizado.",
        action: "Utilize outro email para realizar esse cadastro.",
        statusCode: 400,
      });
    });

    test("with duplicated 'user'", async () => {
      const response = await fetch("http://0.0.0.0:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "useduplicated",
          email: "userduplicated@gmail.com",
          password: "123456",
        }),
      });

      expect(response.status).toBe(201);

      const response2 = await fetch("http://0.0.0.0:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "useduplicated",
          email: "user@gmail.com",
          password: "123456",
        }),
      });

      expect(response2.status).toBe(400);
      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O usuario já está sendo utilizado.",
        action: "Utilize outro usuario para realizar esse cadastro.",
        statusCode: 400,
      });
    });
  });
});
