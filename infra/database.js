import { Client } from "pg";
import { ServiceError } from "./errors";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    return await client.query(queryObject);
  } catch (error) {
    throw new ServiceError({
      cause: error,
      message: "Erro ao executar a query no " + process.env.DB_NAME,
    });
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};
export default database;

function getSSLValues() {
  if (process.env.DB_CA) {
    return {
      ca: process.env.DB_CA,
    };
  }
  return process.env.NODE_ENV === "production";
}
