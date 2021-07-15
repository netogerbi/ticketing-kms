import express, { Request, Response } from "express";
// import { Order } from "../model/order";

const router = express.Router();

router.delete("/api/orders", async (req: Request, res: Response) => {
  // const ticketsFound = await Order.find({});
  const ticketsFound = {};
  res.send(ticketsFound);
});

export { router as deleteOrderRouter };
