import { Ticket } from "../../models/ticket";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
it("marks an order as cancelled", async () => {
  const t = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Rock in Rio",
    price: 870,
  });

  await t.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: t.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  const updated = await Order.findById(order.id);

  expect(updated!.status).toBe(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  const t = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Rock in Rio",
    price: 870,
  });

  await t.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: t.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  const updated = await Order.findById(order.id);

  expect(updated!.status).toBe(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
