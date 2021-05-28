import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../@types/express";

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.currentUser = null;

  if (!req.session?.jwt) {
    return next();
  }

  try {
    const verifyed = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = verifyed;
  } catch (err) {
    console.log("Invalid JWT");
  }

  return next();
};
