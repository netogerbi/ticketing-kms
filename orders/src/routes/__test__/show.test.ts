import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetch an order for a particular user", async () => {
  const ticket = Ticket.build({
    title: "Rave",
    price: 1000,
  });
  await ticket.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: orderFetched } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(orderFetched.id).toBe(order.id);
});

it("return error an user fetch an order of another user", async () => {
  const ticket = Ticket.build({
    title: "Rave",
    price: 1000,
  });
  await ticket.save();

  const user = global.signup();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${mongoose.Types.ObjectId()}`)
    .set("Cookie", user)
    .expect(404);
});

it("return error an user fetch an order of another user", async () => {
  const ticket = Ticket.build({
    title: "Rave",
    price: 1000,
  });
  await ticket.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signup())
    .expect(401);
});
