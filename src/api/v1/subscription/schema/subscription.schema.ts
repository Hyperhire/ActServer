import { Schema, model, Types } from "mongoose";
import { OrderType, PaymentGateway, SubscriptionDate } from "../../../../common/constants";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Subscription {
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
  subscriptionOn: number;
  lastPaidAt: Date;
  inactiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Subscription>({
  userId: { type: Schema.Types.ObjectId },
  targetType: { type: String, enums: Object.values(OrderType) },
  targetId: { type: Schema.Types.ObjectId },
  donationId: { type: Schema.Types.ObjectId },
  pg: { type: String, enums: Object.values(PaymentGateway) },
  amount: { type: Number },
  subscriptionOn: { type: Number, enums: Object.values(SubscriptionDate) },
  kakaoSID: { type: String, isRequired: true }, // kakao pay subscription tansaction id
  active: { type: Boolean, default: true },
  paidCount: { type: Number, default: 1 },
  lastPaidAt: { type: Date },
  inactiveAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SubscriptionModel = model<Subscription>(ModelNames.Subscription, schema);

export { SubscriptionModel };
