import { Schema, model, Types } from "mongoose";
import { ModelNames } from "../../../../common/constants/model.constants";

const schema = new Schema({
  title: { type: String },
  description: { type: String },
  orgId: { type: Schema.Types.ObjectId, ref: ModelNames.Org },
  status: {
    type: String,
    enum: ["PENDING_APPROVAL", "DECLINED", "APPROVED"],
    default: "PENDING_APPROVAL"
  },
  targetAmount: { type: Number, default: 0 },
  currentAmount: { type: Number, default: 0 },
  numberOfDonor: { type: Number, default: 0 },
  donorList: { type: [Schema.Types.ObjectId], default: [] },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  images: {
    type: [String],
    default: [
      "https://thumbs.dreamstime.com/z/ngo-activity-doctor-examine-child-health-clinic-center-which-organized-half-india-s-children-under-age-63979746.jpg"
    ]
  }
});
const CampaignModel = model(ModelNames.Campaign, schema);

export { CampaignModel };
