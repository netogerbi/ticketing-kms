import mongoose from "mongoose";

export type TicketAttrs = {
  title: string;
  price: number;
};

export type TicketDocument = mongoose.Document & TicketAttrs;

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
  return new Ticket(attrs);
};

const Ticket = mongoose.model("Order", schema);

export { Ticket };
