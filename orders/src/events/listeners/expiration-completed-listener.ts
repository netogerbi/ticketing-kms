import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@ntgerbi/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-gropu-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const orderFound = await Order.findById(data.orderId).populate("ticket");

    if (!orderFound) {
      return console.error("Order not found!");
    }

    if (orderFound.status === OrderStatus.Complete) {
      return msg.ack();
    }

    await orderFound.set("status", OrderStatus.Cancelled).save();

    await new OrderCancelledPublisher(this.client).publish({
      id: orderFound.id,
      version: orderFound.version,
      ticket: {
        id: orderFound.ticket.id,
      },
    });

    msg.ack();
  }
}
