import { NotFoundError, requireAuth } from "@ntgerbi/common";
import express, { Request, Response } from "express";
import { Ticket } from "../model/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
