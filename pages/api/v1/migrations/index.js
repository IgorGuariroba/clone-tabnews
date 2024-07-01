import migrationRunner from "node-pg-migrate";
import {join} from "node:path";
import database from "infra/database.js";
export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false
    });
    await dbClient.end();
    const code = migratedMigrations.length > 0 ? 201 : 200;
    response.status(code).json(migratedMigrations);
  } else if (request.method === "GET") {
    const pendMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end();
    response.status(200).json(pendMigrations);
  } else {
    response.status(405).json({error: "Invalid request method"});
  }
}
