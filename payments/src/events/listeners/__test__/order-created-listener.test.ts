import { OrderCreatedEvent, OrderStatus } from "@ntgerbi/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 2021,
    },
    expiresAt: "11111",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const found = await Order.findById(data.id);

  expect(found!.id).toBe(data.id);
  expect(found!.price).toBe(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
