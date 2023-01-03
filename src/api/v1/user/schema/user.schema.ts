import { Schema, model } from "mongoose";
import { LoginType, UserSex, UserStatus } from "../../../../common/constants";
import { ModelNames } from "../../../../common/constants/model.constants";

const schema = new Schema({
  loginType: {
    type: String,
    enums: Object.values(LoginType)
  },
  profileUrl: { type: String },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String },
  constant: {
    getGovernmentReceiptService: {
      type: Boolean,
      isRequired: true
    },
    agreeTnc: { type: Boolean, isRequired: true },
    agreePrivacyPolicy: { type: Boolean, isRequired: true },
    isEmailVerified: { type: Boolean, default: false }
  },
  indInfo: {
    name: { type: String },
    mobile: { type: String },
    dateOfBirth: { type: Date },
    sex: { type: String, enums: Object.values(UserSex) }
  },
  socialProfile: { type: Object },
  status: {
    type: String,
    enums: Object.values(UserStatus),
    default: UserStatus.NORMAL
  },
  wallet: { type: Object },
  deletedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserModel = model(ModelNames.User, schema);

export { UserModel };
