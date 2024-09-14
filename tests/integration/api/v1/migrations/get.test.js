import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

describe("GET /api/v1/migrations", () => {
  describe("Usuario anónimo", () => {
    test("Migrações pendentes", async () => {
      const response = await fetch("http://0.0.0.0:3000/api/v1/migrations");
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
