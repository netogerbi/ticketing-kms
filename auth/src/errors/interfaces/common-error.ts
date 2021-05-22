export type CommonErrorStructure = {
  message: string;
  field?: string;
};

export abstract class CustomError extends Error {
  statusCode: number = 500;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeErrors(): CommonErrorStructure[];
}
