import { requireAuth, validateRequest } from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const ordersFound = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send(ordersFound);
});

export { router as indexOrderRouter };
