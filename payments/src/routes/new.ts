import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ntgerbi/common";
import { stripe } from "../stripe";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Payment } from "../models/payment";

const router = express.Router();

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

    const charge = await stripe.charges.create({
      currency: "USD",
      amount: order.price * 100,
      source: token,
    });

    await Payment.build({
      orderId,
      stripeId: charge.id,
    }).save();

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRoute };
