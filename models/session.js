import crypto from "node:crypto";

import database from "infra/database.js";

// 30 days. Sessions have an absolute expiration: they are not renewed on use.
const SESSION_EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000;

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
  expireByToken,
  SESSION_EXPIRATION_IN_MILLISECONDS,
};

export default session;
