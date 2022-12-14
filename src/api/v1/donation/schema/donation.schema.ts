import { Schema, model, Types } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Donation {
  userId: Types.ObjectId;
  type: string;
  orgId: Types.ObjectId;
  campaignId: Types.ObjectId;
  method: string;
  isRecurring: boolean;
  recurringCount: number;
  recurringOn: string;
  amount: number;
  isTerminated: boolean;
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Donation>({
  userId: { type: Schema.Types.ObjectId },
  type: { type: String, enums: ["ORG", "CAMPAIGN"], isRequired: true },
  orgId: { type: Schema.Types.ObjectId },
  campaignId: { type: Schema.Types.ObjectId },
  isRecurring: { type: Boolean },
  method: { type: String, enums: ["KAKAO", "NAVER"] },
  recurringCount: { type: Number, default: 1 },
  recurringOn: { type: String, enums: ["FIRST", "TENTH", "TWENTIETH"] },
  amount: { type: Number },
  isTerminated: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DonationModel = model<Donation>(ModelNames.Donation, schema);

export { DonationModel };
