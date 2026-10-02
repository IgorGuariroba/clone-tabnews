import database from "infra/database.js";
import password from "models/password.js";
import { NotFoundError, ValidationError } from "infra/errors.js";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
        SELECT *
        FROM users
        WHERE LOWER(username) = LOWER($1)
        LIMIT 1
        ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function findOneById(id) {
  const results = await database.query({
    text: `
      SELECT *
      FROM users
      WHERE id = $1
      LIMIT 1
      ;`,
    values: [id],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "O id informado não foi encontrado no sistema.",
      action: "Verifique se o id está correto.",
    });
  }

  return results.rows[0];
}

async function findOneByUsernameOrEmail(usernameOrEmail) {
  const userFound = await database.query({
    text: `
      SELECT *
      FROM users
      WHERE LOWER(username) = LOWER($1)
        OR LOWER(email) = LOWER($1)
      LIMIT 1
      ;`,
    values: [usernameOrEmail],
  });

  if (userFound.rowCount === 0) {
    throw new NotFoundError({
      message: "O username ou email informado não foi encontrado no sistema.",
      action: "Verifique se o username ou email está digitado corretamente.",
    });
  }

  return userFound.rows[0];
}

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO users (username, email, password)
          VALUES ($1, $2, $3)
            RETURNING *
        ;`,
      values: [userInputValues.username, userInputValues.email, userInputValues.password],
    });
    return results.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);
  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }
  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  return await runUpdateQuery(userWithNewValues);
}

async function runUpdateQuery(userWithNewValues) {
  const results = await database.query({
    text: `
      UPDATE users
      SET username   = $1,
          email      = $2,
          password   = $3,
          updated_at = timezone('utc', now())
      WHERE id = $4 RETURNING *
      ;`,
    values: [userWithNewValues.username, userWithNewValues.email, userWithNewValues.password, userWithNewValues.id],
  });
  return results.rows[0];
}

// The password hash is an internal verifier: it never crosses the HTTP boundary.
function hidePassword(userObject) {
  const safeUserObject = { ...userObject };
  delete safeUserObject.password;
  return safeUserObject;
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
      SELECT username
      FROM users
      WHERE LOWER(username) = LOWER($1)
      ;`,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O username informado já está sendo utilizado.",
      action: "Utilize outro username para realizar esta operação.",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
      SELECT email
      FROM users
      WHERE LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  userInputValues.password = await password.hash(userInputValues.password);
}

const user = {
  create,
  findOneById,
  findOneByUsername,
  findOneByUsernameOrEmail,
  update,
  hidePassword,
};

export default user;
