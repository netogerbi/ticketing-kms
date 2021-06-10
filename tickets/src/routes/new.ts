import { currentUser, requireAuth, validateRequest } from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

const router = express.Router();

const validator = [
  body("title").isString().trim().notEmpty().withMessage("Title must be valid"),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be a floating number"),
];

router.post(
  "/api/tickets",
  currentUser,
  requireAuth,
  validator,
  validateRequest,
  (req: Request, res: Response) => res.send({})
);

export { router as newTicketRouter };
