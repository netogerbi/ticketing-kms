import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@ntgerbi/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const orderFound = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!orderFound) {
      return console.error("Order not found!");
    }

    orderFound.set("status", OrderStatus.Cancelled);
    await orderFound.save();

    msg.ack();
  }
}
