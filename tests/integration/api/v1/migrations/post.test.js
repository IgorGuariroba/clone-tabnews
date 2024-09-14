import orchestrator from "../../../../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Usuario anónimo", () => {
    describe("rodar migrations pendentes", () => {
      test("rodar pela primeira vez", async () => {
        const response = await fetch("http://0.0.0.0:3000/api/v1/migrations", {
          method: "POST",
        });
        expect(response.status).toBe(201);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);

        // Verifique se o primeiro item do array tem a estrutura correta
        const firstItem = responseBody[0];
        expect(firstItem).toHaveProperty("path");
        expect(firstItem).toHaveProperty("name");
        expect(firstItem).toHaveProperty("timestamp");
      });

      test("rodar pela segunda vez", async () => {
        const response2 = await fetch("http://0.0.0.0:3000/api/v1/migrations", {
          method: "POST",
        });
        expect(response2.status).toBe(200);

        const responseBody2 = await response2.json();
        expect(Array.isArray(responseBody2)).toBe(true);
        expect(responseBody2.length).toBe(0);
      });
    });
  });
});
