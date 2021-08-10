import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const validator = [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("ticketId must be provided"),
];

router.post(
  "/api/orders",
  requireAuth,
  validator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticketFound = await Ticket.findById(ticketId);

    if (!ticketFound) {
      throw new NotFoundError();
    }

    const isReserved = await ticketFound.isReserved();

    if (isReserved) {
      throw new BadRequestError(
        "Ticket id " + ticketId + " is already reserved"
      );
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const newOrder = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticketFound,
    });

    await newOrder.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: newOrder.id,
      version: newOrder.version,
      status: newOrder.status,
      userId: newOrder.userId,
      expiresAt: newOrder.expiresAt.toISOString(),
      ticket: {
        id: ticketFound.id,
        price: ticketFound.price,
      },
    });

    res.status(201).send(newOrder);
  }
);

export { router as newOrderRouter };
