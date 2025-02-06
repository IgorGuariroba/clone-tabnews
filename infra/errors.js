export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });

    this.action = "Entre em contato com o suporte";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}
