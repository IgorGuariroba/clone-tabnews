import database from "infra/database.js";

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://0.0.0.0:3000/api/v1/migrations");
  expect(response.status).toBe(200);
  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});