describe("POST /api/v1/status", () => {
  describe("Usuario anónimo", () => {
    test("Consultar status da aplicação", async () => {
      const response = await fetch("http://0.0.0.0:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para esta endpoint",
        action: "Verifique se o método HTTP utilizado é suportado por esta endpoint",
        statusCode: 405,
      });
    });
  });
});
