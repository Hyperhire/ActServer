import { Schema, model, Types } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Order {
  userId: Types.ObjectId;
  targetType: string;
  targetId: Types.ObjectId;
  pg: string;
  amount: number;
  isRecurring: boolean;
  paidStatus: string;
  kakaoTID: string;
  nftHash: string;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Order>({
  userId: { type: Schema.Types.ObjectId },
  targetType: { type: String, enums: ["ORG", "CAMPAIGN"] },
  targetId: { type: Schema.Types.ObjectId },
  pg: { type: String, enums: ["KAKAO", "NAVER"] },
  amount: { type: Number },
  isRecurring: { type: Boolean, default: false },
  paidStatus: {
    type: String,
    enums: ["notyet", "cancel", "approved"],
    default: "notyet"
  }, // ["notyet", "cancel", "approved"]
  kakaoTID: { type: String }, // kakao pay tansaction id - It is temperal
  nftHash: { type: String },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const OrderModel = model<Order>(ModelNames.Order, schema);

export { OrderModel };
