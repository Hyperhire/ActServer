import { Schema, model, Types } from "mongoose";
import {
  OrderPaidStatus,
  SubscriptionDate,
  OrderPaymentType,
  OrderType,
  PaymentGateway,
  OrderWithdrawRequestStatus
} from "../../../../common/constants";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Order {
  userId: Types.ObjectId;
  targetType: string;
  targetId: Types.ObjectId;
  donationId: Types.ObjectId;
  pg: string;
  amount: number;
  paymentType: string;
  subscriptionOn: number;
  paidStatus: string;
  withdrawRequestStatus: string;
  kakaoTID: string;
  kakaoSID: string;
  nft: string;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Order>({
  userId: { type: Schema.Types.ObjectId },
  targetType: { type: String, enums: Object.values(OrderType) },
  targetId: { type: Schema.Types.ObjectId },
  donationId: { type: Schema.Types.ObjectId },
  pg: { type: String, enums: Object.values(PaymentGateway) },
  amount: { type: Number },
  paidStatus: {
    type: String,
    enums: Object.values(OrderPaidStatus),
    default: OrderPaidStatus.NOT_YET
  }, // ["notyet", "cancel", "approved"]
  withdrawRequestStatus: {
    type: String,
    enums: Object.values(OrderWithdrawRequestStatus),
    default: OrderWithdrawRequestStatus.NOT_YET
  },
  paymentType: { type: String, enums: Object.values(OrderPaymentType) },
  subscriptionOn: { type: Number, enums: Object.values(SubscriptionDate) },
  kakaoTID: { type: String }, // kakao pay tansaction id - It is temperal
  kakaoSID: { type: String }, // kakao pay subscription tansaction id
  nft: { type: String },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const OrderModel = model<Order>(ModelNames.Order, schema);

export { OrderModel };
