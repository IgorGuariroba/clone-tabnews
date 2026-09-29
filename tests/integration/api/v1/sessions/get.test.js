import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("/api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("Reading a session is not allowed", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "GET",
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action: "Verifique se o método HTTP enviado é válido para este endpoint.",
        status_code: 405,
      });
    });

    test("Updating a session is not allowed", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action: "Verifique se o método HTTP enviado é válido para este endpoint.",
        status_code: 405,
      });
    });

    test("Patching a session is not allowed", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action: "Verifique se o método HTTP enviado é válido para este endpoint.",
        status_code: 405,
      });
    });
  });
});
