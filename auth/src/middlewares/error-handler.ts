import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/interfaces/common-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  if (err instanceof CustomError) {
    const serializedErr = err.serializeErrors();
    return res.status(err.statusCode).send({
      message: serializedErr,
    });
  }

  return res.status(500).send({
    message: err.message,
  });
};
