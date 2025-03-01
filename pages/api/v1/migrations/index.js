import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "../../../../infra/controller";

const router = createRouter();

async function withDatabaseClient(callback) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    return await callback(dbClient);
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  await withDatabaseClient(async (dbClient) => {
    const pendMigrations = await migrationRunner({ ...defaultMigrationsOptions, dbClient });
    response.status(200).json(pendMigrations);
  });
}

async function postHandler(request, response) {
  await withDatabaseClient(async (dbClient) => {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });

    const code = migratedMigrations.length > 0 ? 201 : 200;
    response.status(code).json(migratedMigrations);
  });
}

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);
