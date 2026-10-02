import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";
import session from "models/session.js";
import user from "models/user.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const token = request.cookies ? request.cookies[session.SESSION_COOKIE_NAME] : undefined;

  if (!isFilledString(token)) {
    throw sessionInvalidError();
  }

  const sessionFound = await session.findOneValidByToken(token);

  if (!sessionFound) {
    throw sessionInvalidError();
  }

  const userFound = await findUserOrNull(sessionFound.user_id);

  if (!userFound) {
    throw sessionInvalidError();
  }

  // The password hash never leaves this endpoint.
  return response.status(200).json(user.hidePassword(userFound));
}

async function findUserOrNull(id) {
  try {
    return await user.findOneById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }

    throw error;
  }
}

function isFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function sessionInvalidError() {
  return new UnauthorizedError({
    message: "Sessão inválida ou expirada.",
    action: "Faça login novamente para continuar.",
  });
}
