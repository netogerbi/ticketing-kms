import { CustomError } from "./interfaces/common-error";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((e) => ({ message: e.msg, field: e.param }));
  }
}
