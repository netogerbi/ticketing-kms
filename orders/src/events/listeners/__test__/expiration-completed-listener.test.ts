import { ExpirationCompleteEvent } from "@ntgerbi/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-completed-listener";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "The Phanton of Opera",
    price: 2000,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "asd321",
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

it("updates the order status to canceled", async () => {
  const { listener, ticket, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updated = await Order.findById(order.id);

  expect(updated!.status).toBe(OrderStatus.Cancelled);
});

it("emits order cancelled event", async () => {
  const { listener, ticket, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("ack the msg", async () => {
  const { listener, ticket, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
