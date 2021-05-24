import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";

const router = express.Router();

const validator = [
  body("email").isEmail().withMessage("E-mail must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be between 4 and 20 characters"),
];

router.post(
  "/api/users/signup",
  validator,
  async (req: Request, res: Response) => {
    const errs = validationResult(req);

    if (!errs.isEmpty()) {
      throw new RequestValidationError(errs.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email is in use");
    }

    const user = User.build({ email, password });
    await user.save();

    return res.status(201).send(user);
  }
);

export { router as signUpRouter };
