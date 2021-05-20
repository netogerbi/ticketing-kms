import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

const validator = [
  body("email").isEmail().withMessage("E-mail must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be between 4 and 20 characters"),
];

router.post("/api/users/signup", validator, (req: Request, res: Response) => {
  const errs = validationResult(req);

  if (!errs.isEmpty()) {
    throw new Error("Invalid email or password");
  }

  console.log("Creating a user...");

  throw new Error("Could not connect to database");
});

export { router as signUpRouter };
