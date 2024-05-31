import database from "infra/database";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();
  database.query("");

  response.status(200).json({
    updatedAt: updatedAt,
  });
}
