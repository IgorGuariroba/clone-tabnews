const response = await fetch("http://localhost:300/api/v1/status");
expect(response.status).toBe(200);
