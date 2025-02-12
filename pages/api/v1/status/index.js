import { createRouter } from "next-connect";
import database from "infra/database";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler);

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

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query("SHOW max_connections;");
  const databaseMaxConnectionsValue = databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.DB_NAME;
  const databaseOpendConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectsValues = databaseOpendConnectionsResult.rows[0].count;

  // Placeholder for Cache status
  const cacheStatus = "Not implemented";

  // Placeholder for External API status
  const externalApiStatus = "Not implemented";

  // Placeholder for RabbitMQ status
  const rabbitMQStatus = "Not implemented";

  // Placeholder for AWS S3 status
  const s3Status = "Not implemented";

  response.status(200).json({
    updatedAt: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connnections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectsValues,
      },
      cache: {
        status: cacheStatus,
      },
      externalApi: {
        status: externalApiStatus,
      },
      rabbitMQ: {
        status: rabbitMQStatus,
      },
      s3: {
        status: s3Status,
      },
    },
  });
}
