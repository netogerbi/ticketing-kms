import { ExpirationCompleteEvent, Subjects, Publisher } from "@ntgerbi/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
