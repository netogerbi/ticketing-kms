import { TicketUpdatedEvent, Publisher, Subjects } from "@ntgerbi/common";

export class TickerUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
