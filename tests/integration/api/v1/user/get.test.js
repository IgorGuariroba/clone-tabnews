import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";

const USER_URL = "http://localhost:3000/api/v1/user";
const SESSIONS_URL = "http://localhost:3000/api/v1/sessions";

// Known-good literal from the agreed contract: cookie absent, unknown token and
// expired session must all answer exactly this, so the response never reveals
// which of the three failed.
const UNAUTHORIZED_BODY = {
  name: "UnauthorizedError",
  message: "Sessão inválida ou expirada.",
  action: "Faça login novamente para continuar.",
  status_code: 401,
};

const METHOD_NOT_ALLOWED_BODY = {
  name: "MethodNotAllowedError",
  message: "Método não permitido para este endpoint.",
  action: "Verifique se o método HTTP enviado é válido para este endpoint.",
  status_code: 405,
};

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/user", () => {
  describe("Anonymous user", () => {
    test("Without session cookie", async () => {
      const response = await fetch(USER_URL);

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual(UNAUTHORIZED_BODY);
    });

    test("With unknown session token", async () => {
      const response = await fetch(USER_URL, {
        headers: {
          Cookie: "session_id=tokenInexistente",
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual(UNAUTHORIZED_BODY);
    });
  });

  describe("Unsupported methods", () => {
    test.each(["POST", "PUT", "PATCH", "DELETE"])("%s is not allowed", async (method) => {
      const response = await fetch(USER_URL, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual(METHOD_NOT_ALLOWED_BODY);
    });
  });

  describe("Authenticated user", () => {
    test("With valid session", async () => {
      await orchestrator.createUser({
        username: "igorGuariroba",
        email: "igorguariroba.dev@gmail.com",
        password: "senha123",
      });

      const token = await loginAndGetToken();

      const response = await fetch(USER_URL, {
        headers: {
          Cookie: `session_id=${token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "igorGuariroba",
        email: "igorguariroba.dev@gmail.com",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(responseBody).not.toHaveProperty("password");
    });

    test("With expired session", async () => {
      const token = await loginAndGetToken();

      // There is no public path to create an already-expired session, so the test
      // arranges that state directly in storage. The assertion still goes through
      // the interface.
      await database.query({
        text: "UPDATE sessions SET expires_at = $1;",
        values: [new Date(Date.now() - 1000)],
      });

      const response = await fetch(USER_URL, {
        headers: {
          Cookie: `session_id=${token}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual(UNAUTHORIZED_BODY);
    });
  });
});

async function loginAndGetToken() {
  const response = await fetch(SESSIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "igorGuariroba",
      password: "senha123",
    }),
  });

  expect(response.status).toBe(201);

  return orchestrator.extractSessionCookie(response);
}
