import { PaymentCreatedEvent, Publisher, Subjects } from "@ntgerbi/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreatedEvent = Subjects.PaymentCreatedEvent;
}
