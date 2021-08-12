import { TicketCreatedEvent } from "@ntgerbi/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-update-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: "João Rock",
  });
  await ticket.save();

  const data: TicketCreatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "John Rock",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const r = await Ticket.findById(ticket.id);

  expect(r).toBeDefined();
  expect(r!.title).toBe(data.title);
  expect(r!.price).toBe(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("is out of order event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage({ ...data, version: 10 }, msg);

  expect(msg.ack).not.toHaveBeenCalled();
});
