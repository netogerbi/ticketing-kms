import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const orderFound = await Order.findById(orderId);

    if (!orderFound) {
      throw new NotFoundError();
    }

    if (orderFound.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    orderFound.status = OrderStatus.Cancelled;
    await orderFound.save();

    res.status(204).send(orderFound);
  }
);

export { router as deleteOrderRouter };
