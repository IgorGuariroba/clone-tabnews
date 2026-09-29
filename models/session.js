import crypto from "node:crypto";

import database from "infra/database.js";

// 30 days. Sessions have an absolute expiration: they are not renewed on use.
const SESSION_EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000;

// Name of the cookie that carries the opaque session token on the client.
const SESSION_COOKIE_NAME = "session_id";

async function create(userId) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_IN_MILLISECONDS);

  const results = await database.query({
    text: `
      INSERT INTO sessions (token, user_id, expires_at)
        VALUES ($1, $2, $3)
          RETURNING id, user_id, expires_at, created_at, updated_at
      ;`,
    values: [hashToken(token), userId, expiresAt],
  });

  // The raw token only crosses this boundary once: it is the value that goes into
  // the client cookie. It is never stored and never readable again.
  return { ...results.rows[0], token };
}

async function findOneValidByToken(token) {
  const results = await database.query({
    text: `
      SELECT *
      FROM sessions
      WHERE token = $1
      LIMIT 1
      ;`,
    values: [hashToken(token)],
  });

  if (results.rowCount === 0) {
    return null;
  }

  const sessionFound = results.rows[0];

  // Expiration is compared in JS (not in SQL) so the branch is reachable by a
  // unit test with a controlled clock.
  if (sessionFound.expires_at <= new Date()) {
    return null;
  }

  return sessionFound;
}

async function expireByToken(token) {
  await database.query({
    text: `
      DELETE FROM sessions
      WHERE token = $1
      ;`,
    values: [hashToken(token)],
  });
}

function generateToken() {
  return crypto.randomBytes(48).toString("base64url");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const session = {
  create,
  findOneValidByToken,
  expireByToken,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRATION_IN_MILLISECONDS,
};

export default session;
