import { currentUser, requireAuth } from "@ntgerbi/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.post(
  "/api/tickets",
  currentUser,
  requireAuth,
  (req: Request, res: Response) => res.send({})
);

export { router as newTicketRouter };
