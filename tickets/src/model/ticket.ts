import mongoose from "mongoose";

export type TicketAttrs = {
  title: string;
  price: number;
  userId: string;
};

export type TicketDocument = mongoose.Document &
  TicketAttrs & {
    version: number;
    createdAt: string;
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
    userId: {
      type: String,
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

schema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

const Ticket = mongoose.model("Ticket", schema);

export { Ticket };
