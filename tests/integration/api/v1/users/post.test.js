import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("with unique and valid data", async () => {
      const userSelect = await orchestrator.db.query("SELECT * FROM users;");
      console.log("userSelect", userSelect);
      const response = await fetch("http://0.0.0.0:3000/api/v1/users", {
        method: "POST",
      });
      expect(response.status).toBe(201);
    });
  });
});
