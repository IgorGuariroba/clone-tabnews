describe("GET /api/v1/status", () => {
  describe("Usuario anónimo", () => {
    test("Consultar status da aplicação", async () => {
      const response = await fetch("http://0.0.0.0:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.updatedAt).toBeDefined();

      const parsedUpdatedAt = new Date(responseBody.updatedAt).toISOString();
      expect(responseBody.updatedAt).toEqual(parsedUpdatedAt);
      expect(responseBody.dependencies.database.version).toEqual("16.0");
      expect(responseBody.dependencies.database.max_connnections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
