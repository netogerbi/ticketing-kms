import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email is in use");
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    return res.status(201).send(user);
  }
);

export { router as signUpRouter };
