import { Schema, model, Types } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Donation {
  name: string;
  userId: Types.ObjectId;
  type: string;
  orgId: string;
  campaignId: string;
  method: string;
  isRecurring: boolean;
  recurringCount: number;
  recurringOn: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Donation>({
  name: { type: String },
  userId: { type: Schema.Types.ObjectId },
  name: { type: String },
  type: { type: String, enums: ["ORG", "CAMPAIGN"], isRequired: true },
  orgId: { type: String },
  campaignId: { type: String },
  isRecurring: { type: Boolean },
  recurringCount: { type: Number },
  recurringOn: { type: String },
  amount: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DonationModel = model<Donation>(ModelNames.Donation, schema);

export { DonationModel };
