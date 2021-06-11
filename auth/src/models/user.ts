import mongoose from "mongoose";
import { Password } from "../services/password";

export type UserAttrs = {
  email: string;
  password: string;
};

export type UserModel = mongoose.Model<UserDocument> & {
  build: BuildFunction;
};

type BuildFunction = (attrs: UserAttrs) => UserDocument;

export type UserDocument = mongoose.Document & UserAttrs;

const schema = new mongoose.Schema<UserDocument, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // { email: string, id: string }
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

schema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hash = await Password.toHash(this.get("password"));
    this.set("password", hash);
  }
  done();
});

schema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model("User", schema);

export { User };
