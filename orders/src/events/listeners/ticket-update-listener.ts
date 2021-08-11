import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@ntgerbi/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-gropu-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findFromEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;

    ticket.set("title", title);
    ticket.set("price", price);

    await ticket.save();

    msg.ack();
  }
}
