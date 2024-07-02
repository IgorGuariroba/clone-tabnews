import migrationRunner from "node-pg-migrate";
import {join} from "node:path";
import database from "infra/database.js";
export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" is not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
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

      const code = migratedMigrations.length > 0 ? 201 : 200;
      response.status(code).json(migratedMigrations);
    } else if (request.method === "GET") {
      const pendMigrations = await migrationRunner(defaultMigrationsOptions);
      response.status(200).json(pendMigrations);
    }
  }catch (error){
    console.log(error);
    throw error;
  }finally {
    await dbClient.end();
  }
}
