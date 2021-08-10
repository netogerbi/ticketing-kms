import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const orderFound = await Order.findById(orderId).populate("ticket");

    if (!orderFound) {
      throw new NotFoundError();
    }

    if (orderFound.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    orderFound.status = OrderStatus.Cancelled;
    await orderFound.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: orderFound.id,
      version: orderFound.version,
      ticket: {
        id: orderFound.ticket.id,
      },
    });

    res.status(204).send(orderFound);
  }
);

export { router as deleteOrderRouter };
