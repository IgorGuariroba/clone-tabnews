import { InternalServerError, MethodNotAllowedError } from "./errors";

function onNoMatchHandler(request, response) {
  const publicErrorObejct = new MethodNotAllowedError();
  response.status(publicErrorObejct.statusCode).json(publicErrorObejct);
}

function onErrorHandler(error, request, response) {
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
