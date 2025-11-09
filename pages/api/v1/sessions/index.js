import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import { UnauthorizedError } from "infra/errors.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  try {
    const storedUser = await user.findOneByEmail(userInputValues.email);
    const correctPasswordMatch = await password.compare(userInputValues.password, storedUser.password);
    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha incorreta.",
        action: "Verifique se o email e a senha estão corretos.",
      });
    }
  } catch (error) {
    throw new UnauthorizedError({
      message: "Email ou senha incorretos.",
      action: "Verifique se o email e a senha estão corretos.",
    });
  }
  return response.status(201).json({});
}
