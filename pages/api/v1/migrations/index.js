import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "../../../../infra/errors";

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

function onNoMatchHandler(request, response) {
  const publicErrorObejct = new MethodNotAllowedError();
  response.status(publicErrorObejct.statusCode).json(publicErrorObejct);
}

function onErrorHandler(error, request, response) {
  const publicErrorObejct = new InternalServerError({
    cause: error,
  });

  console.log("\n erro no catch do next-connect");
  console.error(publicErrorObejct);

  response.status(500).json(publicErrorObejct);
}

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});
