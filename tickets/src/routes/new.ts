import { requireAuth, validateRequest } from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";

const router = express.Router();

const validator = [
  body("title").isString().trim().notEmpty().withMessage("Title must be valid"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a floating number"),
];

router.post(
  "/api/tickets",
  requireAuth,
  validator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const userId = req.currentUser?.id!;

    const newTicket = Ticket.build({ title, price, userId });
    await newTicket.save();

    res.status(201).send(newTicket.toJSON());
  }
);

export { router as newTicketRouter };
