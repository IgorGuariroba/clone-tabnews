import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "igorGuariroba",
          email: "igorguariroba.dev@gmail.com",
          password: "senha123",
        }),
      });

      expect(response.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users/igorGuariroba");
      expect(response2.status).toBe(200);
      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "igorGuariroba",
        email: "igorguariroba.dev@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });

    test("With case mismatch", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "casediferente.dev@gmail.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);

      const response3 = await fetch("http://localhost:3000/api/v1/users/casediferente");
      expect(response3.status).toBe(200);
      const responseBody = await response3.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "CaseDiferente",
        email: "casediferente.dev@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });

    test("With nonexistent username", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users/usernotexistent");
      expect(response.status).toBe(404);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        action: "Verifique se o username está digitado corretamente.",
        message: "O username informado não foi encontrado no sistema.",
        name: "NotFoundError",
        status_code: 404,
      });
    });
  });
});
