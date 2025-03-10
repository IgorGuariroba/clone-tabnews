import orchestrator from "tests/orchestrator.js";
import migrator from "../../../../../models/migrator";
import database from "../../../../../infra/database";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await migrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      await database.query({
        text: "INSERT INFO users (username, email, password) VALUES ($1,$2,$3)",
        values: ["igorguariroba", "igorguariroba@gmail.com", "123456"],
      });

      await database.query({
        text: "INSERT INFO users (username, email, password) VALUES ($1,$2,$3)",
        values: ["igorguariroba", "Igorguariroba@gmail.com", "123456"],
      });

      const response = await fetch("http://0.0.0.0:3000/api/v1/users");
      const users = await database.query("SELECT * FROM users;");
      console.log(users.rows);
      expect(response.status).toBe(201);
    });
  });
});
