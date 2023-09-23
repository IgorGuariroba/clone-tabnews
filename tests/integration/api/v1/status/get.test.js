const axios = require("axios");
test("GET to  /api/v1/status should return 200", async () => {
  const response = await axios.get("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
});
