import { resolve } from "node:path";
import database from "../infra/database";
import migrationRunner from "node-pg-migrate";

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    return await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    return await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
