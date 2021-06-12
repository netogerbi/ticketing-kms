import express, { Request, Response } from "express";

const router = express.Router();

router.put("/api/tickets/:id", async (req: Request, res: Response) => {
  res.send({});
});

export { router as updateTicketRouter };
