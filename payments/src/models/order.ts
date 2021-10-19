import { OrderStatus } from "@ntgerbi/common";
import mongoose from "mongoose";

type OrderAttrs = {
  id: string;
  version: number;
  status: OrderStatus;
  price: number;
  userId: string;
};

type OrderDocument = mongoose.Document & OrderAttrs;

type BuildFunction = (attrs: OrderAttrs) => OrderDocument;

type OrderModel = mongoose.Model<OrderDocument> & {
  build: BuildFunction;
};

const schema = new mongoose.Schema(
  {
    status: {
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
      },
    },
    optimisticConcurrency: true,
    versionKey: "version",
  }
);

schema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    price: attrs.price,
    version: attrs.version,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", schema);

export { Order };
