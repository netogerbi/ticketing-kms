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
  };

type BuildFunction = (attrs: TicketAttrs) => TicketDocument;

export type TicketModel = mongoose.Model<TicketDocument> & {
  build: BuildFunction;
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
  }
);

schema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price });
};

schema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model("Ticket", schema);

export { Ticket };
