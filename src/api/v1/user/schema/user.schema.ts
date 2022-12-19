import { Schema, model } from "mongoose";
import { UserStatus } from "../../../../common/constants";
import { ModelNames } from "../../../../common/constants/model.constants";

const schema = new Schema({
  loginType: {
    type: String,
    enums: ["EMAIL", "NAVER", "KAKAO", "APPLE", "GOOGLE"]
  },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String },
  constant: {
    getGovernmentReceiptService: {
      type: Boolean,
      isRequired: true
    },
    isEmailVerified: { type: Boolean, default: false },
    agreeTnc: { type: Boolean, isRequired: true },
    agreePrivacyPolicy: { type: Boolean, isRequired: true }
  },
  indInfo: {
    name: { type: String },
    mobile: { type: String },
    dateOfBirth: { type: Date }
  },
  status: {
    type: String,
    enums: ["NORMAL", "DELETED"],
    default: UserStatus.NORMAL
  },
  wallet: { type: Object },
  deletedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserModel = model(ModelNames.User, schema);

export { UserModel };
