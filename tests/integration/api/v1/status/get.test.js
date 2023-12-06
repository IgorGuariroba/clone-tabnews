const axios = require("axios");
test("GET to  /api/v1/status should return 200", async () => {
  const response = await axios.get("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
  
  const responseBody =  await  response.data;
  expect(responseBody.updated_at).toBeDefined();
  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);
  console.log(response.data)
});
