import database from "infra/database";

export default async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as sum");
  response.status(200).json({status: "está funcionando"});
}
