import { InternalServerError, MethodNotAllowedError, ValidationError } from "./errors";

function onNoMatchHandler(request, response) {
  const publicErrorObejct = new MethodNotAllowedError();
  response.status(publicErrorObejct.statusCode).json(publicErrorObejct);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObejct = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.log("\n erro no catch do next-connect");
  console.error(publicErrorObejct);

  response.status(publicErrorObejct.statusCode).json(publicErrorObejct);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
