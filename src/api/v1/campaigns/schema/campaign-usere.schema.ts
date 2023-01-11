import { Schema, model, Types } from 'mongoose'
import { ModelNames } from '../../../../common/constants/model.constants'

interface CampaignUser {
    userId: Types.ObjectId,
    orgId: Types.ObjectId,
    campaignId: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const schema = new Schema<CampaignUser>({
    orgId: { type: Schema.Types.ObjectId, ref: ModelNames.Org },
    userId: { type: Schema.Types.ObjectId, ref: ModelNames.User },
    campaignId: { type: Schema.Types.ObjectId, ref: ModelNames.Campaign },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
const CampaignUserModel = model<CampaignUser>(ModelNames.Campaign, schema)

export { CampaignUserModel }