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
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false
    });

    const code = migratedMigrations.length > 0 ? 201 : 200;
    response.status(code).json(migratedMigrations);

  } else if (request.method === "GET") {
    const pendMigrations = await migrationRunner(defaultMigrationsOptions);
    response.status(200).json(pendMigrations);
  } else {
    response.status(405).json({error: "Invalid request method"});
  }
}
