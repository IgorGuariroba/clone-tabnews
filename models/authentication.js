import user from "models/user.js";
import password from "models/password.js";
import { UnauthorizedError, NotFoundError } from "infra/errors.js";

async function findUserByEmail(providedEmail) {
  let storedUser;
  try {
    storedUser = await user.findOneByEmail(providedEmail);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Email ou senha incorretos.",
        action: "Verifique se o email e a senha estão corretos.",
      });
    }
    throw error;
  }
  return storedUser;
}

async function validatePassword(providedPassword, storedPassword) {
  const correctPasswordMatch = await password.compare(providedPassword, storedPassword);
  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Senha incorreta.",
      action: "Verifique se o email e a senha estão corretos.",
    });
  }
}

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se o email e a senha estão corretos.",
      });
    }
    throw error;
  }
}

const authentication = {
  getAuthenticatedUser,
};
export default authentication;
