import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};
