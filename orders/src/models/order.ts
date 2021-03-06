import mongoose from "mongoose";
import { OrderStatus } from "@ntgerbi/common";
import { TicketDocument } from "./ticket";

export { OrderStatus };

export type OrderAttrs = {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
};

export type OrderDocument = mongoose.Document &
  OrderAttrs & {
    version: number;
  };

type BuildFunction = (attrs: OrderAttrs) => OrderDocument;

export type OrderModel = mongoose.Model<OrderDocument> & {
  build: BuildFunction;
};

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    optimisticConcurrency: true,
    versionKey: "version",
  }
);

schema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", schema);

export { Order };
