import { describe, test, expect,beforeAll } from "@jest/globals";
import orchestrator from "../../../../orchestrator";
import database from "../../../../../infra/database";

beforeAll(async () => {
    await orchestrator.waitForAllServices();
    await orchestrator.clearDatabase();
    await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
    describe("Usuario anónimo", () => {        
        test("With unique and valid data", async () => {
            await database.query({
                text: "INSERT INTO users (username,email,password) VALUES ($1,$2,$3)",
                values: ["igorguariroba","igorguariroba.dev@gmail.com","123456"],
            }) 
            
            await database.query({
                text: "INSERT INTO users (username,email,password) VALUES ($1,$2,$3)",
                values: ["Igorguariroba","Igorguariroba.dev@gmail.com","123456"],
            })
            
            const users =  await database.query("SELECT * FROM users");
            console.log(users.rows);
            const response = await fetch("http://0.0.0.0:3000/api/v1/users", {
                method: "POST",
            });
            expect(response.status).toBe(201);

        });
    });
});

