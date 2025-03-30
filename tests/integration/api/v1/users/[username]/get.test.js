import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
    await orchestrator.waitForAllServices();
    await orchestrator.clearDatabase();
    await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users/[username]", () => {
    describe("Anonymous user", () => {
        test("With exact case match", async () => {

            const response = await fetch("http://localhost:3000/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: "igorGuariroba",
                    email: "igorguariroba.dev@gmail.com",
                    password: "senha123",
                }),
            });

            expect(response.status).toBe(201);
            
            const response2 = await fetch("http://localhost:3000/api/v1/users/igorGuariroba");
            expect(response2.status).toBe(200);
            const responseBody = await response2.json();

            expect(responseBody).toEqual({
                id: responseBody.id,
                username: "igorGuariroba",
                email: "igorguariroba.dev@gmail.com",
                password: "senha123",
                created_at: responseBody.created_at,
                updated_at: responseBody.updated_at,
            });
        });
        
    });
});