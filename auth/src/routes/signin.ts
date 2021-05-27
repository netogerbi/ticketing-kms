import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

const validator = [
  body("email").isEmail().withMessage("E-mail must be valid"),
  body("password").trim().notEmpty().withMessage("You must supply a password"),
];

router.post(
  "/api/users/signin",
  validator,
  validateRequest,
  (req: Request, res: Response) => {
    res.send("ahaaaa!!");
  }
);

export { router as signInRouter };
