import { createRouter } from "next-connect";
import { serialize } from "cookie";
import crypto from "node:crypto";

import controller from "infra/controller.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "infra/errors.js";
import user from "models/user.js";
import password from "models/password.js";
import session from "models/session.js";

const INVALID_CREDENTIALS_ERROR = {
  message: "Credenciais inválidas.",
  action: "Verifique se o username (ou email) e a senha informados estão corretos.",
};

const router = createRouter();

router.post(postHandler);
router.delete(deleteHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body || {};
  const usernameOrEmail = userInputValues.username || userInputValues.email;

  if (!isFilledString(usernameOrEmail) || !isFilledString(userInputValues.password)) {
    throw new ValidationError({
      message: "O username (ou email) e a senha são obrigatórios.",
      action: "Informe o username (ou email) e a senha utilizados no cadastro.",
    });
  }

  const userFound = await findUserOrNull(usernameOrEmail);

  // The comparison runs even when the user does not exist, so that a nonexistent
  // user and a wrong password take the same time to answer. Otherwise the response
  // time alone reveals which usernames are registered.
  const passwordMatches = await password.compare(
    userInputValues.password,
    userFound ? userFound.password : await getDummyPasswordHash()
  );

  if (!userFound || !passwordMatches) {
    throw new UnauthorizedError(INVALID_CREDENTIALS_ERROR);
  }

  const newSession = await session.create(userFound.id);

  setSessionCookie(response, newSession.token, session.SESSION_EXPIRATION_IN_MILLISECONDS / 1000);

  // The password hash never leaves the session endpoint.
  return response.status(201).json(user.hidePassword(userFound));
}

async function deleteHandler(request, response) {
  const token = request.cookies ? request.cookies[session.SESSION_COOKIE_NAME] : undefined;

  if (isFilledString(token)) {
    await session.expireByToken(token);
  }

  // Always expire the cookie, even when there was no valid session: logout is
  // idempotent and must never leave a stale token on the client.
  setSessionCookie(response, "", 0);

  return response.status(204).send();
}

function setSessionCookie(response, token, maxAgeInSeconds) {
  response.setHeader(
    "Set-Cookie",
    serialize(session.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: maxAgeInSeconds,
    })
  );
}

function isFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function findUserOrNull(usernameOrEmail) {
  try {
    return await user.findOneByUsernameOrEmail(usernameOrEmail);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }

    throw error;
  }
}

let dummyPasswordHash;

async function getDummyPasswordHash() {
  // Hashed with the same cost as a real password and cached, so the dummy
  // comparison costs the same as a real one on every environment.
  dummyPasswordHash ??= password.hash(crypto.randomUUID());

  return dummyPasswordHash;
}
