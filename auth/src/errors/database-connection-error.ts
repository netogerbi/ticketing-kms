import { CommonErrorStructure, CustomError } from "./interfaces/common-error";

export class DatabaseConnectionError extends CustomError {
  message = "Could not connect to database";

  constructor() {
    super("Error connecting to db.");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
