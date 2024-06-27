import database from "infra/database.js";

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://0.0.0.0:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);

  // Verifique se o primeiro item do array tem a estrutura correta
  const firstItem = responseBody[0];
  expect(firstItem).toHaveProperty('path');
  expect(firstItem).toHaveProperty('name');
  expect(firstItem).toHaveProperty('timestamp');

  const response2 = await fetch("http://0.0.0.0:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const responseBody2 = await response2.json();
  expect(Array.isArray(responseBody2)).toBe(true);
  expect(responseBody2.length).toBe(0);
});
