import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import Authentication from "models/authentication.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;
  await Authentication.getAuthenticatedUser(userInputValues.email, userInputValues.password);
  return response.status(201).json({});
}
