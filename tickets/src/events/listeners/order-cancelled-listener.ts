import { Listener, OrderCancelledEvent, Subjects } from "@ntgerbi/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { TickerUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      return console.log("Ticket not found");
    }

    ticket.set("orderId", undefined);

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
