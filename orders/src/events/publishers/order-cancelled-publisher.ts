import { OrderCancelledEvent, Publisher, Subjects } from "@ntgerbi/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
