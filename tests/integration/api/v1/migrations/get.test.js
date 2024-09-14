import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

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
