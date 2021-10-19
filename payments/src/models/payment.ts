import mongoose from "mongoose";

type PaymentAttrs = {
  orderId: string;
  stripeId: string;
};

type PaymentDocument = mongoose.Document & PaymentAttrs;

type BuildFn = (attrs: PaymentAttrs) => PaymentDocument;

type PaymentModel = mongoose.Model<PaymentDocument> & {
  build: BuildFn;
};

const schema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

schema.static("build", (attrs: PaymentAttrs) => new Payment(attrs));

const Payment = mongoose.model<PaymentDocument, PaymentModel>(
  "Payment",
  schema
);

export { Payment };
