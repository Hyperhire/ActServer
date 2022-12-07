import { Schema, model, Types } from 'mongoose'
import { ModelNames } from '../../common/constants/model.constants'

interface Campaign {
    name: string,
    orgId: Types.ObjectId,
    start_at: Date,
    end_at: Date,
    images: Array<String>,
    createdAt: Date,
    updatedAt: Date
}

const schema = new Schema<Campaign>({
    name: { type: String },
    orgId: { type: Schema.Types.ObjectId, ref: ModelNames.Org },
    start_at: { type: Date, default: Date.now },
    end_at: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    images: { type: [String], default: ["https://thumbs.dreamstime.com/z/ngo-activity-doctor-examine-child-health-clinic-center-which-organized-half-india-s-children-under-age-63979746.jpg"] }

})
const CampaignModel = model<Campaign>(ModelNames.Campaign, schema)

export { CampaignModel }