import { Schema, model } from 'mongoose'
import { ModelNames } from '../../common/constants/model.constants'

export enum AssetType {
    BANNER = "banner",
    CAMPAIGN = "campaign"
}

interface Org {
    assetType: string,
    urls: Array<string>
}

const schema = new Schema<Org>({
    assetType: { type: String },
    urls: { type: [String], enum: AssetType }
})
const OrgModel = model<Org>(ModelNames.Org, schema)

export { OrgModel }