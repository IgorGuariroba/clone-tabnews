import migrationRunner from "node-pg-migrate";
import {join} from "node:path";

export default async function migrations(request, response) {
  const defaultMigrationsOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  }

  if (request.method === "POST") {
    const migrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false
    });
    response.status(200).json(migrations);
  } else if (request.method === "GET") {
    const migrations = await migrationRunner(defaultMigrationsOptions);
    response.status(200).json(migrations);
  } else {
    response.status(405).json({error: "Invalid request method"});
  }
}
