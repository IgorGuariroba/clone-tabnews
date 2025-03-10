import database from "../infra/database";
import { ValidationError } from "../infra/errors";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  return await runInsertQuery(userInputValues);

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `SELECT email
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O email já está sendo utilizado.",
        action: "Utilize outro email para realizar esse cadastro.",
      });
    }
  }
  async function validateUniqueUsername(userName) {
    const results = await database.query({
      text: `SELECT username
             FROM users
             WHERE LOWER(username) = LOWER($1)`,
      values: [userName],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O usuario já está sendo utilizado.",
        action: "Utilize outro usuario para realizar esse cadastro.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [userInputValues.username, userInputValues.email, userInputValues.password],
    });

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;
