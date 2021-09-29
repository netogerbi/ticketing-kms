import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 5; //15 * 60;

const validator = [
  body("token").not().isEmpty().withMessage("Token must be provided"),
  body("orderId").not().isEmpty().withMessage("Order ID must be provided"),
];

router.post(
  "/api/payments",
  requireAuth,
  validator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay order cancelled!");
    }

    res.send({ success: true });
  }
);

export { router as createChargeRoute };
