import { Schema, model, Types } from "mongoose";
import {
  OrderType,
  PaymentGateway,
  SubscriptionDate
} from "../../../../common/constants";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Donation {
  userId: Types.ObjectId;
  targetType: string;
  targetId: Types.ObjectId;
  pg: string;
  amount: number;
  paymentType: string;
  subscriptionOn: number;
  isTerminated: boolean;
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Donation>({
  userId: { type: Schema.Types.ObjectId },
  targetType: {
    type: String,
    enums: Object.values(OrderType),
    isRequired: true
  },
  targetId: { type: Schema.Types.ObjectId },
  pg: { type: String, enums: Object.values(PaymentGateway) },
  paymentType: {type: String},
  subscriptionOn: {type: Number, enums: Object.values(SubscriptionDate)},
  amount: { type: Number },
  isTerminated: { type: Boolean, default: false },
  startedAt: { type: Date },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DonationModel = model<Donation>(ModelNames.Donation, schema);

export { DonationModel };
