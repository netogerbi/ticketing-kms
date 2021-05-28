import { CommonErrorStructure, CustomError } from "./interfaces/common-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  message = "Unauthorized!";

  constructor() {
    super("Unauthorized!");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): CommonErrorStructure[] {
    return [{ message: this.message }];
  }
}
