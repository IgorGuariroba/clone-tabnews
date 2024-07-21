import database from "infra/database";

export default async function status(request, response) {
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

  response.status(200).json({
    updatedAt: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connnections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectsValues,
      },
    },
  });
}
