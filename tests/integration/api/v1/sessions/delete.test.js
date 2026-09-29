import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";

const SESSIONS_URL = "http://localhost:3000/api/v1/sessions";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.createUser({
    username: "igorGuariroba",
    email: "igorguariroba.dev@gmail.com",
    password: "senha123",
  });
});

describe("DELETE /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With valid session", async () => {
      const token = await loginAndGetToken();

      const response = await fetch(SESSIONS_URL, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${token}`,
        },
      });

      expect(response.status).toBe(204);

      const setCookie = response.headers.get("set-cookie");

      expect(setCookie).toContain("session_id=;");
      expect(setCookie).toContain("Max-Age=0");
      expect(setCookie).toContain("HttpOnly");

      // Deliberate exception to "assert through the interface": the endpoint exposes no
      // read path, so "the session is really gone" is only observable in storage.
      const sessions = await database.query("SELECT * FROM sessions;");

      expect(sessions.rowCount).toBe(0);
    });

    test("With expired session", async () => {
      const token = await loginAndGetToken();

      await database.query({
        text: "UPDATE sessions SET expires_at = $1;",
        values: [new Date(Date.now() - 1000)],
      });

      const response = await fetch(SESSIONS_URL, {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${token}`,
        },
      });

      expect(response.status).toBe(204);

      const sessions = await database.query("SELECT * FROM sessions;");

      expect(sessions.rowCount).toBe(0);
    });

    test("Without session cookie", async () => {
      const response = await fetch(SESSIONS_URL, {
        method: "DELETE",
      });

      expect(response.status).toBe(204);

      const setCookie = response.headers.get("set-cookie");

      expect(setCookie).toContain("session_id=;");
      expect(setCookie).toContain("Max-Age=0");
    });

    test("With unknown session token", async () => {
      const response = await fetch(SESSIONS_URL, {
        method: "DELETE",
        headers: {
          Cookie: "session_id=tokenInexistente",
        },
      });

      expect(response.status).toBe(204);

      const setCookie = response.headers.get("set-cookie");

      expect(setCookie).toContain("session_id=;");
      expect(setCookie).toContain("Max-Age=0");
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
