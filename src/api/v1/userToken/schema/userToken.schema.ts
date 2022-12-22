import { Types, Schema, model } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";
import { UserType } from "./../../../../common/constants";

const schema = new Schema({
  userId: { type: Types.ObjectId, unique: true },
  userType: { type: String, enums: Object.values(UserType) },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserTokenModel = model(ModelNames.UserToken, schema);

export { UserTokenModel };
