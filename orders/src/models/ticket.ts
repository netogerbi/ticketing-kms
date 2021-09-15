import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

export type TicketAttrs = {
  id: string;
  title: string;
  price: number;
};

export type TicketDocument = mongoose.Document &
  TicketAttrs & {
    isReserved(): Promise<boolean>;
    version: number;
  };

type BuildFunction = (attrs: TicketAttrs) => TicketDocument;

type FindFromEvent = (event: {
  id: string;
  version: number;
}) => Promise<TicketDocument | null>;

export type TicketModel = mongoose.Model<TicketDocument> & {
  build: BuildFunction;
  findFromEvent: FindFromEvent;
};

const schema = new mongoose.Schema<TicketDocument, TicketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

schema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price });
};

schema.statics.findFromEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};

schema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        //@ts-ignore
        OrderStatus.Created,
        //@ts-ignore
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model("Ticket", schema);

export { Ticket };
