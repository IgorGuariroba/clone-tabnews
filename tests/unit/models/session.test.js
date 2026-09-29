import session from "models/session.js";
import database from "infra/database.js";

// The database is the system boundary here: it is mocked so the clock can be
// controlled with fake timers. With a real DB, now() is PostgreSQL's clock and
// advancing the test timer would prove nothing.
jest.mock("infra/database.js");

const NOW = "2026-01-01T00:00:00.000Z";

describe("models/session", () => {
  describe("findOneValidByToken", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(NOW));
      database.query.mockReset();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("Returns null when the token is unknown", async () => {
      database.query.mockResolvedValue({ rowCount: 0, rows: [] });

      const result = await session.findOneValidByToken("tokenInexistente");

      expect(result).toBeNull();
    });

    test("Returns the session while still within the expiration", async () => {
      const sessionRow = {
        id: "session-id",
        user_id: "user-id",
        expires_at: new Date("2026-01-01T00:00:01.000Z"),
      };
      database.query.mockResolvedValue({ rowCount: 1, rows: [sessionRow] });

      const result = await session.findOneValidByToken("tokenValido");

      expect(result).toEqual(sessionRow);
    });

    test("Returns null once the expiration has passed", async () => {
      database.query.mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            id: "session-id",
            user_id: "user-id",
            expires_at: new Date("2025-12-31T23:59:59.000Z"),
          },
        ],
      });

      const result = await session.findOneValidByToken("tokenExpirado");

      expect(result).toBeNull();
    });

    test("Returns null exactly at the expiration instant", async () => {
      database.query.mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            id: "session-id",
            user_id: "user-id",
            expires_at: new Date(NOW),
          },
        ],
      });

      const result = await session.findOneValidByToken("tokenNoLimite");

      expect(result).toBeNull();
    });
  });
});
