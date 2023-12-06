import database from "infra/database";

export default async function status(req, res) {
    const updateAt = new Date().toISOString();

    const versionResult = await database.query("SELECT version()");
    const databaseVersion = versionResult.rows[0].version;

    const connectionsResult = await database.query("SELECT COUNT(*) FROM pg_stat_activity");
    const connections = connectionsResult.rows[0].count;

    const activeConnectionsResult = await database.query("SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active'");
    const activeConnections = activeConnectionsResult.rows[0].count;

    res.status(200).json({
        updated_at: updateAt,
        database_version: databaseVersion,
        connections: connections,
        active_connections: activeConnections
    });
}
