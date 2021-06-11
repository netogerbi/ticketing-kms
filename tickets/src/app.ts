import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError, errorHandler } from "@ntgerbi/common";
import { newTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";

const app = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(newTicketRouter);
app.use(showTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
