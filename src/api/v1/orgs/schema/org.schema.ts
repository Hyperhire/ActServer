import { Schema, model } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";
import { OrgStatus } from "./../../../../common/constants";

// {
//   "loginType": "EMAIL",
//   "email": "juhyun@gmail.com",
//   "nickname": "JUHYUNHAHAHA",
//   "name": "NGO",
//   "password": "1q1q1q1q!",
//   "manager": {
//       "name": "Juhyun Kim",
//       "mobile": "01029222406"
//   },
//   "businessRegistrationUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fitem.kakaocdn.net%2Fdo%2F717fa436c9fe7a058b5729539e3bb9a4f604e7b0e6900f9ac53a43965300eb9a&imgrefurl=https%3A%2F%2Fe.kakao.com%2Ft%2Fdetective-conan-ver5&tbnid=H3xIV3mMLHID1M&vet=12ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg..i&docid=5xlC9oGzWlF_DM&w=210&h=210&q=%EC%BD%94%EB%82%9C%20%EC%9D%B4%EB%AF%B8%EC%A7%80&ved=2ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg",
//   "businessRegistrationNumber": "427-86-01187",
//   "homepageUrl": "https://zigup.in",
//   "logoUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fitem.kakaocdn.net%2Fdo%2F717fa436c9fe7a058b5729539e3bb9a4f604e7b0e6900f9ac53a43965300eb9a&imgrefurl=https%3A%2F%2Fe.kakao.com%2Ft%2Fdetective-conan-ver5&tbnid=H3xIV3mMLHID1M&vet=12ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg..i&docid=5xlC9oGzWlF_DM&w=210&h=210&q=%EC%BD%94%EB%82%9C%20%EC%9D%B4%EB%AF%B8%EC%A7%80&ved=2ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg",
//   "imageUrls": [
//       "https://www.google.com/imgres?imgurl=https%3A%2F%2Fitem.kakaocdn.net%2Fdo%2F717fa436c9fe7a058b5729539e3bb9a4f604e7b0e6900f9ac53a43965300eb9a&imgrefurl=https%3A%2F%2Fe.kakao.com%2Ft%2Fdetective-conan-ver5&tbnid=H3xIV3mMLHID1M&vet=12ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg..i&docid=5xlC9oGzWlF_DM&w=210&h=210&q=%EC%BD%94%EB%82%9C%20%EC%9D%B4%EB%AF%B8%EC%A7%80&ved=2ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg",
//       "https://www.google.com/imgres?imgurl=https%3A%2F%2Fitem.kakaocdn.net%2Fdo%2F717fa436c9fe7a058b5729539e3bb9a4f604e7b0e6900f9ac53a43965300eb9a&imgrefurl=https%3A%2F%2Fe.kakao.com%2Ft%2Fdetective-conan-ver5&tbnid=H3xIV3mMLHID1M&vet=12ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg..i&docid=5xlC9oGzWlF_DM&w=210&h=210&q=%EC%BD%94%EB%82%9C%20%EC%9D%B4%EB%AF%B8%EC%A7%80&ved=2ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg"
//   ],
//   "shortDescription": "Short Description",
//   "longDescription": "Loooooooooooong",
//   "bankDetail": {
//       "bankName": "",
//       "accountHolder": "",
//       "acountNumber": "",
//       "accountCopyUrl": ""
//   },
//   "bannerUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fitem.kakaocdn.net%2Fdo%2F717fa436c9fe7a058b5729539e3bb9a4f604e7b0e6900f9ac53a43965300eb9a&imgrefurl=https%3A%2F%2Fe.kakao.com%2Ft%2Fdetective-conan-ver5&tbnid=H3xIV3mMLHID1M&vet=12ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg..i&docid=5xlC9oGzWlF_DM&w=210&h=210&q=%EC%BD%94%EB%82%9C%20%EC%9D%B4%EB%AF%B8%EC%A7%80&ved=2ahUKEwi-jt_mkIH8AhXV6mEKHTqpAKMQMygTegUIARCLAg"
// }

const schema = new Schema({
  loginType: {
    type: String,
    enums: ["EMAIL", "NAVER", "KAKAO", "APPLE", "GOOGLE"]
  },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String },
  manager: {
    name: { type: String },
    mobile: { type: String }
  },
  businessRegistrationUrl: { type: String },
  businessRegistrationNumber: { type: String },
  homepageUrl: { type: String },
  logoUrl: { type: String },
  imageUrls: { type: [String] },
  shortDescription: { type: String },
  longDescription: { type: String },
  bankDetail: {
    bankName: { type: String },
    accountHolder: { type: String },
    acountNumber: { type: String },
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
    enums: ["PENDING", "AUTHORIZED", "UNAVAILABLE", "DELETED"],
    default: OrgStatus.AUTHORIZED
  },
  deletedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const OrgModel = model(ModelNames.Org, schema);

export { OrgModel };
