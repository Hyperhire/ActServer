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
    images: string
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
    corporateId: { type: String },
    images: { type: String, default: "https://media.istockphoto.com/id/870402320/photo/a-social-worker-meeting-with-a-group-of-villagers.jpg?s=612x612&w=is&k=20&c=JAQOTjAdXVOlOa8kdmuv7nhXJfw8H6SGI9QqLIRvpTU="}
})
const OrgModel = model<Org>(ModelNames.Org, schema)

export { OrgModel }