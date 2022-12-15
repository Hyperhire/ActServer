import { Schema, model, Types } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

interface Donation {
  userId: Types.ObjectId;
  targetType: string;
  tagetId: Types.ObjectId;
  pg: string;
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
  targetType: { type: String, enums: ["ORG", "CAMPAIGN"], isRequired: true },
  tagetId: { type: Schema.Types.ObjectId },
  isRecurring: { type: Boolean },
  pg: { type: String, enums: ["KAKAO", "NAVER"] },
  recurringCount: { type: Number, default: 1 },
  recurringOn: { type: String, enums: ["FIRST", "TENTH", "TWENTIETH"] },
  amount: { type: Number },
  isTerminated: { type: Boolean, default: false },
  startedAt: { type: Date },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DonationModel = model<Donation>(ModelNames.Donation, schema);

export { DonationModel };
