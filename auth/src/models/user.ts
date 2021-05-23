import mongoose from "mongoose";

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

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
