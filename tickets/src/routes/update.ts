import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";

const router = express.Router();

const validator = [
  body("title").isString().trim().notEmpty().withMessage("Title must be valid"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a floating number and grater than 0"),
];

router.put(
  "/api/tickets/:id",
  requireAuth,
  validator,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
