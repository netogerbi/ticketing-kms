import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TickerUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../model/ticket";
import { natsWrapper } from "../nats-wrapper";

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

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    if (!ticket.isModified()) return res.send(ticket);

    await ticket.save();

    new TickerUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    return res.send(ticket);
  }
);

export { router as updateTicketRouter };
