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

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema<UserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hash = await Password.toHash(this.get("password"));
    this.set("password", hash);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
