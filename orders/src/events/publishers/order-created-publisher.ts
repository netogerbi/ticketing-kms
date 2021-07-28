import { OrderCreatedEvent, Publisher, Subjects } from "@ntgerbi/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
