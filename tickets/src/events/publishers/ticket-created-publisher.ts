import { TicketCreatedEvent, Publisher, Subjects } from "@ntgerbi/common";

export class TickerCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
