import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";

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

describe("POST /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("Retrieving session with valid username", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
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

      const setCookie = response.headers.get("set-cookie");

      expect(setCookie).toContain("session_id=");
      expect(setCookie).toContain("HttpOnly");
      expect(setCookie).toContain("SameSite=Lax");
      expect(setCookie).toContain("Path=/");
      expect(setCookie).toContain("Max-Age=2592000");
    });

    test("Retrieving session with valid email", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "igorguariroba.dev@gmail.com",
          password: "senha123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "igorGuariroba",
        email: "igorguariroba.dev@gmail.com",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(response.headers.get("set-cookie")).toContain("session_id=");
    });

    test("With wrong password", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "igorGuariroba",
          password: "senhaErrada",
        }),
      });

      expect(response.status).toBe(401);
      expect(response.headers.get("set-cookie")).toBe(null);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Credenciais inválidas.",
        action: "Verifique se o username (ou email) e a senha informados estão corretos.",
        status_code: 401,
      });
    });

    test("With nonexistent username", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usuarioInexistente",
          password: "senha123",
        }),
      });

      expect(response.status).toBe(401);
      expect(response.headers.get("set-cookie")).toBe(null);

      const responseBody = await response.json();

      // Must be indistinguishable from the wrong password response, otherwise the
      // endpoint tells an attacker which usernames exist.
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Credenciais inválidas.",
        action: "Verifique se o username (ou email) e a senha informados estão corretos.",
        status_code: 401,
      });
    });

    // Deliberate exception to "assert through the interface": the endpoint exposes no
    // read path, and "the raw token never reaches disk" is only observable in storage.
    test("Does not store the raw session token", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
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

      const token = orchestrator.extractSessionCookie(response);

      expect(token).toBeTruthy();

      const sessions = await database.query("SELECT * FROM sessions ORDER BY created_at DESC LIMIT 1;");
      const storedSession = sessions.rows[0];

      expect(JSON.stringify(storedSession)).not.toContain(token);
      expect(storedSession.token).toMatch(/^[0-9a-f]{64}$/);
    });

    test("Without body", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      expect(response.headers.get("set-cookie")).toBe(null);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username (ou email) e a senha são obrigatórios.",
        action: "Informe o username (ou email) e a senha utilizados no cadastro.",
        status_code: 400,
      });
    });

    test("Without password", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "igorGuariroba",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username (ou email) e a senha são obrigatórios.",
        action: "Informe o username (ou email) e a senha utilizados no cadastro.",
        status_code: 400,
      });
    });

    test("Without username and email", async () => {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "senha123",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username (ou email) e a senha são obrigatórios.",
        action: "Informe o username (ou email) e a senha utilizados no cadastro.",
        status_code: 400,
      });
    });
  });
});
