import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
const router = createRouter();

router.post(postHandler);

async function postHandler(request, response) {
  const userInputValue = request.body;
  const newUser = await user.create(userInputValue);
  return response.status(201).json(newUser);
}

export default router.handler(controller.errorHandlers);
