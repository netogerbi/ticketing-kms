import { Listener, OrderCreatedEvent, Subjects } from "@ntgerbi/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { queueGroupName } from "./queue-group-name";
import { TickerUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      return console.log("Ticket not found");
    }

    ticket.set("orderId", data.id);

    await ticket.save();

    const publisher = new TickerUpdatedPublisher(this.client);

    await publisher.publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
