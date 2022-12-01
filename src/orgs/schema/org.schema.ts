import { Schema, model } from 'mongoose'
import { ModelNames } from '../../common/constants/model.constants'

interface Org {
    name: string,
    email: string,
    nickname: string,
    password: string
    createdAt: Date,
    updatedAt: Date
    orgName: string
    managerName: string
    managerMobile: string
    homepage: string
    corporateId: string
}

const schema = new Schema<Org>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    nickname: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    orgName: { type: String },
    managerName: { type: String },
    managerMobile: { type: String },
    homepage: { type: String },
    corporateId: { type: String }
})
const OrgModel = model<Org>(ModelNames.Org, schema)

export { OrgModel }