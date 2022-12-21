import { Schema, model, Types } from "mongoose";
import { OrderPaidStatus } from "../../../../common/constants";
import { ModelNames } from "../../../../common/constants/model.constants";

interface SubscriptionOrder {
  userId: Types.ObjectId;
  targetType: string;
  targetId: Types.ObjectId;
  donationId: Types.ObjectId;
  pg: string;
  amount: number;
  paidStatus: string;
  kakaoSID: string;
  active: boolean;
  paidCount: number;
  lastPaidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<SubscriptionOrder>({
  userId: { type: Schema.Types.ObjectId },
  targetType: { type: String, enums: ["ORG", "CAMPAIGN"] },
  targetId: { type: Schema.Types.ObjectId },
  donationId: { type: Schema.Types.ObjectId },
  pg: { type: String, enums: ["KAKAO", "NAVER"] },
  amount: { type: Number },
  kakaoSID: { type: String }, // kakao pay subscription tansaction id
  active: { type: Boolean, default: true },
  paidCount: { type: Number, default: 1 },
  lastPaidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SubscriptionOrderModel = model<SubscriptionOrder>(
  ModelNames.SubscriptionOrder,
  schema
);

export { SubscriptionOrderModel };
