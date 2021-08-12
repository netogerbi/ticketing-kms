import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Rave",
    price: 1000,
  });
  return await ticket.save();
};

it("fetch orders for a particular user", async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = global.signup();
  const user2 = global.signup();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const r = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  expect(r.body.length).toBe(2);
  expect(r.body[0].id).toBe(order1.id);
  expect(r.body[1].id).toBe(order2.id);
  expect(r.body[0].ticket.id).toBe(ticket2.id);
  expect(r.body[1].ticket.id).toBe(ticket3.id);
});
