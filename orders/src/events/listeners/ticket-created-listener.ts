import { Listener, Subjects, TicketCreatedEvent } from "@ntgerbi/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-gropu-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price } = data;

    const ticket = Ticket.build({
      title,
      price,
    });

    ticket.save();

    msg.ack();
  }
}