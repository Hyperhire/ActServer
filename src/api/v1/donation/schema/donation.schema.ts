import { Schema, model, Types } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Donation {
  name: string;
  type: string;
  orgId: string;
  campaignId: string;
  isRecurring: boolean;
  recurringCount: number;
  recurringOn: string;
  amount: number;
  nftId: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Donation>({
    name: { type: String },
    type: { type: String },
    orgId: { type: String },
    campaignId: { type: String },
    isRecurring: { type: Boolean },
    recurringCount: { type: Number },
    recurringOn: { type: String },
    amount: { type: Number },
    nftId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
const DonationModel = model<Donation>(ModelNames.Donation, schema);

export { DonationModel };