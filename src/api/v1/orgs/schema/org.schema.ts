import { Schema, model } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";
import { LoginType, OrgStatus } from "./../../../../common/constants";

// {
//   "loginType": "EMAIL",
//   "email": "juhyun123@gmail.com",
//   "nickname": "JUHYUNHAHAHA123",
//   "name": "NGO 22",
//   "password": "1q1q1q1q!",
//   "constant": {
//       "agreeTnc": true,
//       "agreePrivacyPolicy": true
//   },
//   "manager": {
//       "name": "Juhyun Kim",
//       "mobile": "01029222406"
//   },
//   "businessRegistrationUrl": "https://doact-dev.s3.ap-northeast-2.amazonaws.com/business-registration/1671445836789_img.png",
//   "businessRegistrationNumber": "427-86-01187",
//   "homepageUrl": "https://zigup.in"
// }

const schema = new Schema({
  loginType: {
    type: String,
    enums: Object.values(LoginType)
  },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String },
  socialProfile: { type: Object },
  manager: {
    name: { type: String },
    mobile: { type: String }
  },
  constant: {
    agreeTnc: { type: Boolean, isRequired: true },
    agreePrivacyPolicy: { type: Boolean, isRequired: true },
    isEmailVerified: { type: Boolean, default: false }
  },
  businessRegistrationUrl: { type: String },
  businessRegistrationNumber: { type: String },
  homepageUrl: { type: String },
  logoUrl: { type: String },
  imageUrls: { type: [String]},
  shortDescription: { type: String },
  longDescription: { type: String },
  bankDetail: {
    bankName: { type: String },
    accountHolder: { type: String },
    accountNumber: { type: String },
    accountCopyUrl: { type: String }
  },
  nftImageUrl: {
    type: String,
    default:
      "https://metadata-store.klaytnapi.com/fd2f81df-cfaa-32f4-bbfa-52ad7b378c6f/510703c4-127d-ecfa-d3a0-8065a44c103c.png"
  },
  bannerUrl: { type: String },
  status: {
    type: String,
    enums: Object.values(OrgStatus),
    default: OrgStatus.PENDING
  },
  deletedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const OrgModel = model(ModelNames.Org, schema);

export { OrgModel };
